"use client";

import { useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import type { Opportunity } from "@/lib/data";
import { products, users } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const generateQuoteSchema = z.object({
  expiryDate: z.string().min(1, "Expiry date is required."),
  document: z.any().optional(),
  lineItems: z.array(z.object({
    productId: z.string(),
    quantity: z.coerce.number(),
    unitPrice: z.coerce.number(),
    discountType: z.enum(['none', 'percentage', 'fixed']).default('none'),
    discountValue: z.coerce.number().optional(),
  })).min(1, "A quote must have at least one product."),
  attachPo: z.boolean().default(false),
  poNumber: z.string().optional(),
  poValue: z.coerce.number().optional(),
  poDate: z.string().optional(),
  poDocument: z.any().optional(),
}).refine(data => {
    for (const item of data.lineItems) {
        if (item.discountType !== 'none' && (!item.discountValue || item.discountValue <= 0)) {
            return false;
        }
    }
    return true;
}, {
    message: "A positive discount value is required for the selected discount type.",
    path: ["lineItems"],
}).refine(data => {
    if (data.attachPo && !data.poNumber) {
        return false;
    }
    return true;
}, {
    message: "PO number is required when attaching a PO.",
    path: ["poNumber"],
}).refine(data => {
    if (data.attachPo && (!data.poValue || data.poValue <= 0)) {
        return false;
    }
    return true;
}, {
    message: "A positive PO value is required.",
    path: ["poValue"],
}).refine(data => {
    if (data.attachPo && !data.poDate) {
        return false;
    }
    return true;
}, {
    message: "PO date is required.",
    path: ["poDate"],
});


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
      lineItems: opportunity.lineItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product?.price || 0,
          discountType: 'none',
          discountValue: 0,
        }
      }),
      attachPo: false,
      poNumber: "",
      poValue: undefined,
      poDate: "",
    },
  });

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "lineItems"
  });

  const onSubmit = (values: GenerateQuoteFormValues) => {
    onSave(values);
  };

  const lineItems = form.watch("lineItems");
  const attachPo = form.watch("attachPo");

  const totals = lineItems.reduce((acc, item) => {
    const lineTotal = item.unitPrice * item.quantity;
    let discountAmount = 0;
    if (item.discountType === 'percentage') {
      discountAmount = lineTotal * ((item.discountValue || 0) / 100);
    } else if (item.discountType === 'fixed') {
      discountAmount = item.discountValue || 0;
    }
    acc.subtotal += lineTotal;
    acc.discount += discountAmount;
    acc.grandTotal += (lineTotal - discountAmount);
    return acc;
  }, { subtotal: 0, discount: 0, grandTotal: 0 });

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
                          <TableHead className="w-[180px]">Discount</TableHead>
                          <TableHead className="w-[120px] text-right">Line Total</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {fields.map((field, index) => {
                          const product = products.find(p => p.id === field.productId);
                          const lineItem = lineItems[index];
                          const lineTotal = lineItem.unitPrice * lineItem.quantity;
                          let finalLineTotal = lineTotal;
                          if (lineItem.discountType === 'percentage') {
                            finalLineTotal -= lineTotal * ((lineItem.discountValue || 0) / 100);
                          } else if (lineItem.discountType === 'fixed') {
                            finalLineTotal -= (lineItem.discountValue || 0);
                          }

                          return (
                              <TableRow key={field.id} className="align-top">
                                  <TableCell className="font-medium pt-4">
                                      <p>{product?.name}</p>
                                      <p className="text-xs text-muted-foreground">{lineItem.quantity} x ₹{lineItem.unitPrice.toLocaleString('en-IN')}</p>
                                  </TableCell>
                                  <TableCell>
                                      <FormField
                                        control={form.control}
                                        name={`lineItems.${index}.discountType`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex items-center space-x-2"
                                                  >
                                                    <FormItem className="flex items-center space-x-1 space-y-0">
                                                      <RadioGroupItem value="none" id={`none-${index}`}/>
                                                      <Label htmlFor={`none-${index}`} className="font-normal text-xs">N/A</Label>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-1 space-y-0">
                                                      <RadioGroupItem value="percentage" id={`percentage-${index}`}/>
                                                      <Label htmlFor={`percentage-${index}`} className="font-normal text-xs">%</Label>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-1 space-y-0">
                                                      <RadioGroupItem value="fixed" id={`fixed-${index}`}/>
                                                      <Label htmlFor={`fixed-${index}`} className="font-normal text-xs">₹</Label>
                                                    </FormItem>
                                                  </RadioGroup>
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                       {lineItems[index].discountType !== 'none' && (
                                          <FormField
                                            control={form.control}
                                            name={`lineItems.${index}.discountValue`}
                                            render={({ field }) => (
                                              <FormItem className="mt-1">
                                                <FormControl>
                                                  <Input 
                                                    type="number" 
                                                    className="h-8"
                                                    placeholder="Value"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                  />
                                                </FormControl>
                                              </FormItem>
                                            )}
                                          />
                                        )}
                                  </TableCell>
                                  <TableCell className="text-right pt-4">
                                    {lineTotal !== finalLineTotal && (
                                       <p className="text-xs line-through text-muted-foreground">₹{lineTotal.toLocaleString('en-IN')}</p>
                                    )}
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
                   <div className="flex justify-between font-bold text-base">
                    <span>Grand Total</span>
                    <span>₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                  </div>
              </div>
          </div>
        </div>
        
        <Separator />

        <div className="space-y-4">
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
