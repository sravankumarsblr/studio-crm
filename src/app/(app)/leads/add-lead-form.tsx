"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { companies, contacts, products } from "@/lib/data";

const addLeadSchema = z.object({
  name: z.string().min(1, "Lead name is required."),
  value: z.coerce.number().min(0, "Value must be a positive number."),
  source: z.string().min(1, "Source is required."),
  companyId: z.string().min(1, "Company is required."),
  contactIds: z
    .array(z.string())
    .refine((value) => value.length > 0, {
      message: "You have to select at least one contact.",
    }),
  productIds: z
    .array(z.string())
    .refine((value) => value.length > 0, {
      message: "You have to select at least one product.",
    }),
});

export type AddLeadFormValues = z.infer<typeof addLeadSchema>;

export function AddLeadForm({
  onSave,
  onCancel,
}: {
  onSave: (data: AddLeadFormValues) => void;
  onCancel: () => void;
}) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const form = useForm<AddLeadFormValues>({
    resolver: zodResolver(addLeadSchema),
    defaultValues: {
      name: "",
      value: 0,
      source: "",
      companyId: "",
      contactIds: [],
      productIds: [],
    },
  });

  const availableContacts = selectedCompanyId
    ? contacts.filter((c) => c.companyId === selectedCompanyId)
    : [];

  const onSubmit = (values: AddLeadFormValues) => {
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
              <FormLabel>Lead Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Q3 Calibration Contract" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 50000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Web Form" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedCompanyId(value);
                  form.setValue("contactIds", []);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCompanyId && (
          <FormField
            control={form.control}
            name="contactIds"
            render={() => (
              <FormItem>
                <FormLabel>Contacts</FormLabel>
                <FormControl>
                  <ScrollArea className="h-32 rounded-md border">
                    <div className="p-2">
                      {availableContacts.length > 0 ? (
                        availableContacts.map((contact) => (
                          <FormField
                            key={contact.id}
                            control={form.control}
                            name="contactIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={contact.id}
                                  className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md hover:bg-secondary"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(contact.id)}
                                      onCheckedChange={(checked) => {
                                        const newValues = checked
                                          ? [...(field.value || []), contact.id]
                                          : field.value?.filter(
                                              (value) => value !== contact.id
                                            ) || [];
                                        field.onChange(newValues);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal w-full cursor-pointer">
                                    {contact.name}
                                    <span className="text-muted-foreground ml-2">({contact.email})</span>
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground p-2">
                          No contacts found for this company.
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="productIds"
          render={() => (
            <FormItem>
              <FormLabel>Products & Services</FormLabel>
              <FormControl>
                <ScrollArea className="h-32 rounded-md border">
                  <div className="p-2">
                    {products.map((product) => (
                      <FormField
                        key={product.id}
                        control={form.control}
                        name="productIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={product.id}
                              className="flex flex-row items-center space-x-3 space-y-0 p-2 rounded-md hover:bg-secondary"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(product.id)}
                                  onCheckedChange={(checked) => {
                                      const newValues = checked
                                        ? [...(field.value || []), product.id]
                                        : field.value?.filter(
                                            (value) => value !== product.id
                                          ) || [];
                                      field.onChange(newValues);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal w-full cursor-pointer">
                                {product.name}
                                <span className="text-muted-foreground ml-2">({product.category})</span>
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Lead</Button>
        </div>
      </form>
    </Form>
  );
}
