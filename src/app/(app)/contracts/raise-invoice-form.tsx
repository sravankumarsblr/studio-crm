
"use client";

import { useForm } from "react-hook-form";
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

const raiseInvoiceSchema = (maxAmount: number) => z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required."),
  invoiceAmount: z.coerce.number().positive("Amount must be positive.").max(maxAmount, `Amount cannot exceed remaining balance of ₹${maxAmount.toLocaleString('en-IN')}`),
  invoiceDocument: z.any().optional(),
});


export type RaiseInvoiceFormValues = z.infer<ReturnType<typeof raiseInvoiceSchema>>;

type RaiseInvoiceFormProps = {
  onSave: (data: RaiseInvoiceFormValues) => void;
  onCancel: () => void;
  remainingAmount: number;
};

export function RaiseInvoiceForm({ onSave, onCancel, remainingAmount }: RaiseInvoiceFormProps) {
  const form = useForm<RaiseInvoiceFormValues>({
    resolver: zodResolver(raiseInvoiceSchema(remainingAmount)),
    defaultValues: {
      invoiceNumber: "",
      invoiceAmount: remainingAmount,
      invoiceDocument: undefined,
    },
  });

  const onSubmit = (values: RaiseInvoiceFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
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
          name="invoiceAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Amount (₹)</FormLabel>
              <FormControl><Input type="number" placeholder="Enter amount" {...field} /></FormControl>
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
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Raise Invoice</Button>
        </div>
      </form>
    </Form>
  );
}
