
"use client";

import { useState, useMemo, useEffect } from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { companies, contacts, products, Lead } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const editLeadSchema = z.object({
  name: z.string().min(1, "Lead name is required."),
  value: z.coerce.number().min(0, "Value must be a positive number."),
  status: z.string().min(1, "Status is required."),
  source: z.string().min(1, "Source is required."),
  companyId: z.string().min(1, "Company is required."),
  contactIds: z
    .array(z.string())
    .min(1, "You must select at least one contact."),
  primaryContactId: z.string().optional(),
  productIds: z
    .array(z.string())
    .min(1, "You have to select at least one product."),
  convertToDeal: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.contactIds.length > 0) {
      return !!data.primaryContactId;
    }
    return true;
  },
  {
    message: "You must designate one contact as primary.",
    path: ["primaryContactId"],
  }
);

export type EditLeadFormValues = z.infer<typeof editLeadSchema>;

export function EditLeadForm({
  lead,
  onSave,
  onCancel,
}: {
  lead: Lead;
  onSave: (data: EditLeadFormValues) => void;
  onCancel: () => void;
}) {
  const [companyOpen, setCompanyOpen] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const defaultValues = useMemo(() => {
    const company = companies.find(c => c.name === lead.companyName);
    const primaryContact = contacts.find(c => c.name === lead.contactName && c.companyId === company?.id);
    const associatedProducts = products.filter(p => p.associatedId === lead.id);

    return {
      name: lead.name,
      value: lead.value,
      status: lead.status,
      source: lead.source,
      companyId: company?.id || "",
      contactIds: primaryContact ? [primaryContact.id] : [],
      primaryContactId: primaryContact?.id || "",
      productIds: associatedProducts.map(p => p.id),
      convertToDeal: false,
    };
  }, [lead]);

  const form = useForm<EditLeadFormValues>({
    resolver: zodResolver(editLeadSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const selectedCompanyId = form.watch("companyId");
  const selectedContactIds = form.watch("contactIds");

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

  const handleContactCheckedChange = (checked: boolean, contactId: string) => {
    const currentContactIds = form.getValues("contactIds") || [];
    const currentPrimaryId = form.getValues("primaryContactId");
    
    let newContactIds: string[];
    if (checked) {
      newContactIds = [...currentContactIds, contactId];
    } else {
      newContactIds = currentContactIds.filter((id) => id !== contactId);
    }
    form.setValue("contactIds", newContactIds, { shouldValidate: true });

    if (!checked && currentPrimaryId === contactId) {
      form.setValue("primaryContactId", newContactIds[0] || "", { shouldValidate: true });
    } else if (checked && newContactIds.length === 1) {
      form.setValue("primaryContactId", contactId, { shouldValidate: true });
    }
  };

  const onSubmit = (values: EditLeadFormValues) => {
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <div className="grid grid-cols-2 gap-4">
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
                                  form.setValue("companyId", c.id, { shouldValidate: true });
                                  form.setValue("contactIds", []);
                                  form.setValue("primaryContactId", "");
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
        </div>

        <FormField
          control={form.control}
          name="primaryContactId"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2 flex items-baseline justify-between">
                <FormLabel>Contacts</FormLabel>
                <FormMessage className="text-xs">
                  {form.formState.errors.contactIds?.message}
                </FormMessage>
              </div>
              <div className="rounded-md border">
                <div className="border-b p-2">
                  <Input
                    placeholder="Search contacts..."
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                    disabled={!selectedCompanyId}
                  />
                </div>
                <ScrollArea className="h-36">
                  <RadioGroup
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                    className="p-2"
                  >
                    {filteredContacts.length > 0 ? (
                      filteredContacts.map((contact) => (
                        <div key={contact.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-secondary">
                          <Checkbox
                            id={`contact-edit-${contact.id}`}
                            checked={selectedContactIds.includes(contact.id)}
                            onCheckedChange={(checked) => {
                              handleContactCheckedChange(!!checked, contact.id);
                            }}
                          />
                          <RadioGroupItem
                            value={contact.id}
                            id={`primary-edit-${contact.id}`}
                            disabled={!selectedContactIds.includes(contact.id)}
                          />
                           <label
                              htmlFor={`primary-edit-${contact.id}`}
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between font-normal",
                                !selectedContactIds.includes(contact.id) && "cursor-not-allowed opacity-50"
                              )}
                            >
                              <span>
                                {contact.name}
                                <span className="ml-2 text-muted-foreground">({contact.email})</span>
                              </span>
                              {field.value === contact.id && (
                                <Badge variant="secondary">Primary</Badge>
                              )}
                            </label>
                        </div>
                      ))
                    ) : (
                      <p className="p-2 text-center text-sm text-muted-foreground">
                        {selectedCompanyId ? "No contacts found." : "Select a company to see contacts."}
                      </p>
                    )}
                  </RadioGroup>
                </ScrollArea>
              </div>
               <FormMessage />
            </FormItem>
          )}
        />
        
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

        <FormField
          control={form.control}
          name="convertToDeal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-secondary/50">
              <div className="space-y-0.5">
                <FormLabel>Create a Deal</FormLabel>
                <FormDescription>
                  Also create a new deal for this lead in the pipeline.
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
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
