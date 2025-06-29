
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
}).refine(data => {
    if (data.discountType !== 'none' && (!data.discountValue || data.discountValue <= 0)) {
        return false;
    }
    return true;
}, {
    message: "A positive discount value is required.",
    path: ["discountValue"],
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
      discountValue: undefined,
    },
  });

  const onSubmit = (values: GenerateQuoteFormValues) => {
    onSave(values);
  };

  const discountType = form.watch("discountType");

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
            name="discountType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === 'none') {
                        form.setValue('discountValue', undefined);
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
                <FormLabel>Attach Document</FormLabel>
                <FormControl>
                  <Input 
                      type="file"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                </FormControl>
                <FormDescription>Attach a PO or quote document.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
