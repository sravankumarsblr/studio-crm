"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [companyOpen, setCompanyOpen] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

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

  const selectedCompanyId = form.watch("companyId");

  const availableContacts = selectedCompanyId
    ? contacts.filter((c) => c.companyId === selectedCompanyId)
    : [];

  const filteredContacts = availableContacts.filter(c => 
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) || 
    c.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

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
            <FormItem className="flex flex-col">
              <FormLabel>Company</FormLabel>
              <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={companyOpen}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? companies.find((c) => c.id === field.value)?.name
                        : "Select a company"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search company..." />
                    <CommandEmpty>No company found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {companies.map((c) => (
                          <CommandItem
                            value={c.name}
                            key={c.id}
                            onSelect={() => {
                              form.setValue("companyId", c.id);
                              form.setValue("contactIds", []);
                              setCompanyOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                c.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {c.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
                   <div className="rounded-md border">
                    <div className="p-2 border-b">
                       <Input 
                        placeholder="Search contacts..."
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                       />
                    </div>
                    <ScrollArea className="h-32">
                      <div className="p-2">
                        {filteredContacts.length > 0 ? (
                          filteredContacts.map((contact) => (
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
                            No contacts found.
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                   </div>
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
                <div className="rounded-md border">
                    <div className="p-2 border-b">
                       <Input 
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                       />
                    </div>
                  <ScrollArea className="h-32">
                    <div className="p-2">
                      {filteredProducts.map((product) => (
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
                </div>
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
