
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const raiseInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required."),
});

export type RaiseInvoiceFormValues = z.infer<typeof raiseInvoiceSchema>;

type RaiseInvoiceFormProps = {
  onSave: (data: RaiseInvoiceFormValues) => void;
  onCancel: () => void;
};

export function RaiseInvoiceForm({ onSave, onCancel }: RaiseInvoiceFormProps) {
  const form = useForm<RaiseInvoiceFormValues>({
    resolver: zodResolver(raiseInvoiceSchema),
    defaultValues: {
      invoiceNumber: "",
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
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Raise Invoice</Button>
        </div>
      </form>
    </Form>
  );
}
