
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { products as allProducts, type Contract, type Milestone } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";

const raiseInvoiceSchema = (maxAmount: number) => z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required."),
  invoiceDocument: z.any().optional(),
  lineItems: z.array(z.object({
    productId: z.string(),
    quantity: z.coerce.number().min(0, "Quantity must be non-negative."),
    unitPrice: z.coerce.number().min(0, "Price must be non-negative."),
  })).min(1, "At least one item must be in the invoice."),
}).refine(data => {
    const total = data.lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    return total > 0;
}, {
    message: "Invoice total must be greater than zero.",
    path: ['lineItems'],
}).refine(data => {
    const total = data.lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    return total <= maxAmount;
}, {
    message: `Invoice total cannot exceed remaining milestone value of ₹${maxAmount.toLocaleString('en-IN')}`,
    path: ['lineItems'],
});

export type RaiseInvoiceFormValues = z.infer<ReturnType<typeof raiseInvoiceSchema>>;

type RaiseInvoiceFormProps = {
  onSave: (data: RaiseInvoiceFormValues) => void;
  onCancel: () => void;
  milestone: Milestone;
  contract: Contract;
  remainingAmount: number;
};

export function RaiseInvoiceForm({ onSave, onCancel, milestone, contract, remainingAmount }: RaiseInvoiceFormProps) {
  const milestoneProducts = contract.lineItems
    .filter(item => milestone.productIds.includes(item.productId))
    .map(item => ({
        ...item,
        product: allProducts.find(p => p.id === item.productId)
    }));
    
  const form = useForm<RaiseInvoiceFormValues>({
    resolver: zodResolver(raiseInvoiceSchema(remainingAmount)),
    defaultValues: {
      invoiceNumber: "",
      invoiceDocument: undefined,
      lineItems: milestoneProducts.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.product?.price || 0,
      })),
    },
  });

  const { fields } = useFieldArray({ control: form.control, name: "lineItems" });
  const lineItems = form.watch('lineItems');

  const totalValue = lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);

  const onSubmit = (values: RaiseInvoiceFormValues) => {
    // Filter out items with 0 quantity before saving
    const finalValues = {
        ...values,
        lineItems: values.lineItems.filter(item => item.quantity > 0)
    };
    onSave(finalValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl><Input placeholder="e.g., INV-2024-001" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="invoiceDocument"
            render={({ field: { onChange, ...rest} }) => (
                <FormItem>
                <FormLabel>Attach Invoice (PDF)</FormLabel>
                <FormControl>
                    <Input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                    {...rest}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="w-24">Quantity</TableHead>
                        <TableHead className="w-32 text-right">Unit Price (₹)</TableHead>
                        <TableHead className="w-32 text-right">Total (₹)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => {
                        const product = allProducts.find(p => p.id === field.productId);
                        const lineItem = lineItems[index];
                        return (
                            <TableRow key={field.id}>
                                <TableCell className="font-medium">{product?.name}</TableCell>
                                <TableCell>
                                     <FormField
                                        control={form.control}
                                        name={`lineItems.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormControl><Input type="number" {...field} className="h-8" /></FormControl>
                                        )}
                                        />
                                </TableCell>
                                <TableCell>
                                    <FormField
                                        control={form.control}
                                        name={`lineItems.${index}.unitPrice`}
                                        render={({ field }) => (
                                            <FormControl><Input type="number" {...field} className="h-8 text-right" /></FormControl>
                                        )}
                                        />
                                </TableCell>
                                <TableCell className="text-right">
                                    {(lineItem.quantity * lineItem.unitPrice).toLocaleString('en-IN')}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
            <div className="flex justify-end p-4 border-t font-medium">
                Total Invoice Amount: ₹{totalValue.toLocaleString('en-IN')}
            </div>
             {form.formState.errors.lineItems && (
                <p className="px-4 pb-2 text-sm font-medium text-destructive">
                    {form.formState.errors.lineItems.message || form.formState.errors.lineItems.root?.message}
                </p>
            )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Raise Invoice</Button>
        </div>
      </form>
    </Form>
  );
}
