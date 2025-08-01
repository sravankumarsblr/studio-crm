
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
import type { Company as Customer } from "@/lib/data";
import { gstStatuses } from "@/lib/data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const editCustomerSchema = z.object({
  name: z.string().min(1, "Customer name is required."),
  industry: z.string().min(1, "Industry is required."),
  website: z.string().url("Please enter a valid URL.").or(z.literal("")),
  numberOfEmployees: z.string().min(1, "Number of employees is required."),
  gstStatus: z.enum(gstStatuses, { required_error: "GST status is required."}),
});

export type EditCustomerFormValues = z.infer<typeof editCustomerSchema>;

export function EditCustomerForm({
  customer,
  onSave,
  onCancel,
}: {
  customer: Customer,
  onSave: (data: EditCustomerFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<EditCustomerFormValues>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
        name: customer.name,
        industry: customer.industry,
        website: customer.website,
        numberOfEmployees: customer.numberOfEmployees,
        gstStatus: customer.gstStatus,
    },
  });

  const onSubmit = (values: EditCustomerFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Technology" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfEmployees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Employees</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 100-500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
            control={form.control}
            name="gstStatus"
            render={({ field }) => (
                <FormItem className="space-y-3">
                <FormLabel>GST Status</FormLabel>
                <FormControl>
                    <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                    >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="GST" />
                        </FormControl>
                        <FormLabel className="font-normal">GST</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                        <RadioGroupItem value="Non-GST" />
                        </FormControl>
                        <FormLabel className="font-normal">Non-GST</FormLabel>
                    </FormItem>
                    </RadioGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
