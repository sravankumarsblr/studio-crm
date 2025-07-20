
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import type { Opportunity, Quote } from "@/lib/data";
import { products } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const poStatuses = ["Received", "Acceptance Mail", "On Phone"] as const;

const generateQuoteSchema = z.object({
  expiryDate: z.string().min(1, "Expiry date is required."),
  document: z.any().optional(),
  lineItems: z.array(z.object({
    productId: z.string(),
    quantity: z.coerce.number(),
    unitPrice: z.coerce.number(),
    finalUnitPrice: z.coerce.number(),
  })).min(1, "A quote must have at least one product."),
  gstRate: z.coerce.number().min(0).default(18),
  showGst: z.boolean().default(true),
  attachPo: z.boolean().default(false),
  poNumber: z.string().optional(),
  poValue: z.coerce.number().optional(),
  poDate: z.string().optional(),
  poStatus: z.enum(poStatuses).optional(),
  poDocument: z.any().optional(),
}).refine(data => {
    if (data.attachPo && !data.poNumber) return false;
    return true;
}, { message: "PO number is required when attaching a PO.", path: ["poNumber"] })
.refine(data => {
    if (data.attachPo && (!data.poValue || data.poValue <= 0)) return false;
    return true;
}, { message: "A positive PO value is required.", path: ["poValue"] })
.refine(data => {
    if (data.attachPo && !data.poDate) return false;
    return true;
}, { message: "PO date is required.", path: ["poDate"] })
.refine(data => {
    if (data.attachPo && !data.poStatus) return false;
    return true;
}, { message: "PO Status is required when attaching a PO.", path: ["poStatus"] });


export type GenerateQuoteFormValues = z.infer<typeof generateQuoteSchema>;

export function GenerateQuoteForm({
  opportunity,
  onSave,
  onCancel,
}: {
  opportunity: Opportunity,
  onSave: (data: GenerateQuoteFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<GenerateQuoteFormValues>({
    resolver: zodResolver(generateQuoteSchema),
    defaultValues: {
      expiryDate: "",
      lineItems: opportunity.lineItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        finalUnitPrice: item.price, // Default final price is the original price
      })),
      gstRate: 18,
      showGst: true,
      attachPo: false,
      poNumber: "",
      poValue: undefined,
      poDate: "",
      poStatus: undefined,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "lineItems"
  });

  const onSubmit = (values: GenerateQuoteFormValues) => {
    onSave(values);
  };

  const lineItems = form.watch("lineItems");
  const gstRate = form.watch("gstRate");
  const attachPo = form.watch("attachPo");

  const totals = lineItems.reduce((acc, item) => {
    const originalLineTotal = item.unitPrice * item.quantity;
    const finalLineTotal = item.finalUnitPrice * item.quantity;
    const discountAmount = originalLineTotal - finalLineTotal;

    acc.subtotal += originalLineTotal;
    acc.discount += discountAmount;
    acc.totalBeforeGst += finalLineTotal;
    return acc;
  }, { subtotal: 0, discount: 0, totalBeforeGst: 0 });

  const gstAmount = totals.totalBeforeGst * (gstRate / 100);
  const grandTotal = totals.totalBeforeGst + gstAmount;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
        <div>
          <h3 className="text-lg font-medium mb-2">Line Items</h3>
          <div className="rounded-md border bg-card">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="w-[150px]">Final Unit Price (₹)</TableHead>
                          <TableHead className="w-[150px] text-right">Discount</TableHead>
                          <TableHead className="w-[150px] text-right">Line Total</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {fields.map((field, index) => {
                          const product = products.find(p => p.id === field.productId);
                          const lineItem = lineItems[index];
                          const originalLineTotal = lineItem.unitPrice * lineItem.quantity;
                          const finalLineTotal = lineItem.finalUnitPrice * lineItem.quantity;
                          const discountAmount = originalLineTotal - finalLineTotal;

                          return (
                              <TableRow key={field.id} className="align-top">
                                  <TableCell className="font-medium pt-4">
                                      <p>{product?.name}</p>
                                      <p className="text-xs text-muted-foreground">{lineItem.quantity} x ₹{lineItem.unitPrice.toLocaleString('en-IN')}</p>
                                  </TableCell>
                                  <TableCell className="pt-2">
                                     <FormField
                                        control={form.control}
                                        name={`lineItems.${index}.finalUnitPrice`}
                                        render={({ field }) => (
                                            <Input 
                                                type="number" 
                                                className="h-9"
                                                {...field}
                                            />
                                        )}
                                      />
                                  </TableCell>
                                  <TableCell className="text-right pt-4">
                                    <p className="font-medium">₹{discountAmount.toLocaleString('en-IN')}</p>
                                  </TableCell>
                                  <TableCell className="text-right pt-4">
                                    <p className="font-medium">₹{finalLineTotal.toLocaleString('en-IN')}</p>
                                  </TableCell>
                              </TableRow>
                          );
                      })}
                  </TableBody>
              </Table>
               <div className="p-4 space-y-2 text-sm border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                   <div className="flex justify-between text-destructive">
                    <span className="text-muted-foreground">Discount</span>
                    <span>- ₹{totals.discount.toLocaleString('en-IN')}</span>
                  </div>
                   <Separator />
                   <div className="flex justify-between font-bold">
                    <span>Total Before Tax</span>
                    <span>₹{totals.totalBeforeGst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>GST</span>
                        <FormField
                            control={form.control}
                            name="gstRate"
                            render={({ field }) => (
                                <Input type="number" className="h-7 w-16" {...field} />
                            )}
                        />
                        <span>%</span>
                      </div>
                      <span>+ ₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                   <Separator />
                   <div className="flex justify-between font-bold text-base">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
              </div>
          </div>
        </div>
        
        <Separator />

        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(new Date(field.value), "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="showGst"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-fit mt-auto">
                        <div className="space-y-0.5">
                        <FormLabel>Show GST on Quote</FormLabel>
                        </div>
                        <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                    </FormItem>
                    )}
                />
            </div>
          
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attach Quote Document</FormLabel>
                <FormControl>
                  <Input 
                      type="file"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />
        
        <div>
          <FormField
            control={form.control}
            name="attachPo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-secondary/50">
                <div className="space-y-0.5">
                  <FormLabel>Attach PO and mark as Accepted</FormLabel>
                  <FormDescription>
                    Use this option if you have received the Purchase Order and are ready to close the opportunity.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {attachPo && (
            <div className="space-y-4 pt-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="poNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Order Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PO-ACPL-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                    control={form.control}
                    name="poStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>PO Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select PO Status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {poStatuses.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
               </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="poValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PO Value (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 50000" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="poDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>PO Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                  control={form.control}
                  name="poDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attach PO Document</FormLabel>
                      <FormControl>
                        <Input 
                            type="file"
                            onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                          />
                      </FormControl>
                      <FormDescription>Attach the customer's purchase order document.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Generate Quote</Button>
        </div>
      </form>
    </Form>
  );
}
