
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
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
import { products } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const generateQuoteSchema = z.object({
  value: z.coerce.number().min(1, "Quote value is required."),
  expiryDate: z.string().min(1, "Expiry date is required."),
  document: z.any().optional(),
  discountType: z.enum(['none', 'percentage', 'fixed']).default('none'),
  discountValue: z.coerce.number().optional(),
  attachPo: z.boolean().default(false),
  poNumber: z.string().optional(),
  poValue: z.coerce.number().optional(),
  poDate: z.string().optional(),
  poDocument: z.any().optional(),
}).refine(data => {
    if (data.discountType !== 'none' && (!data.discountValue || data.discountValue <= 0)) {
        return false;
    }
    return true;
}, {
    message: "A positive discount value is required.",
    path: ["discountValue"],
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
      value: opportunity.value,
      expiryDate: "",
      discountType: 'none',
      discountValue: 0,
      attachPo: false,
      poNumber: "",
      poValue: undefined,
      poDate: "",
    },
  });

  const onSubmit = (values: GenerateQuoteFormValues) => {
    onSave(values);
  };

  const discountType = form.watch("discountType");
  const attachPo = form.watch("attachPo");

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
                          <TableHead className="w-[100px]">Quantity</TableHead>
                          <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                          <TableHead className="w-[120px] text-right">Total</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {opportunity.lineItems.map(item => {
                          const product = products.find(p => p.id === item.productId);
                          if (!product) return null;
                          const total = product.price * item.quantity;
                          return (
                              <TableRow key={item.productId} className="bg-muted/30">
                                  <TableCell className="font-medium">{product.name}</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell className="text-right">₹{product.price.toLocaleString('en-IN')}</TableCell>
                                  <TableCell className="text-right">₹{total.toLocaleString('en-IN')}</TableCell>
                              </TableRow>
                          );
                      })}
                  </TableBody>
              </Table>
               <div className="p-2 text-right font-medium pr-4 border-t">
                  List Price Total: <span className="text-lg font-bold">₹{opportunity.value.toLocaleString('en-IN')}</span>
              </div>
          </div>
        </div>
        
        <Separator />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quoted Value (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormDescription>This value can be adjusted from the line item total if needed.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>

          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === 'none') {
                        form.setValue('discountValue', 0);
                        form.clearErrors('discountValue');
                      }
                    }}
                    defaultValue={field.value}
                    className="flex items-center space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="none" />
                      </FormControl>
                      <FormLabel className="font-normal">None</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="percentage" />
                      </FormControl>
                      <FormLabel className="font-normal">Percentage (%)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fixed" />
                      </FormControl>
                      <FormLabel className="font-normal">Fixed (₹)</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {discountType && discountType !== 'none' && (
            <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl>
                      <Input 
                          type="number" 
                          placeholder={discountType === 'percentage' ? "e.g., 10" : "e.g., 500"} 
                           {...field}
                           value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}

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
                      <Input placeholder="e.g., PO12345" {...field} />
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
