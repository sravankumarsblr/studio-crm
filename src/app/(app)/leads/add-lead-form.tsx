
"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { companies as staticCompanies, contacts, products, users, Company } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { AddCompanyDialog } from "../companies/add-company-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductSelectorDialog } from "../products/product-selector-dialog";

const addLeadSchema = z.object({
  name: z.string().min(1, "Lead name is required."),
  ownerId: z.string().min(1, "Lead owner is required."),
  status: z.string().min(1, "Status is required."),
  source: z.string().min(1, "Source is required."),
  companyId: z.string().min(1, "Company is required."),
  contactIds: z
    .array(z.string())
    .min(1, "You must select at least one contact."),
  primaryContactId: z.string().optional(),
  lineItems: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().min(1, "Qty must be at least 1."),
  })).min(1, "Please add at least one product."),
  convertToOpportunity: z.boolean().default(false),
}).refine(
  (data) => {
    // If there are contacts selected, a primary contact must also be selected.
    if (data.contactIds.length > 0) {
      return !!data.primaryContactId;
    }
    return true;
  },
  {
    message: "You must designate one contact as primary.",
    path: ["primaryContactId"], // Point error to the primary contact field
  }
);

export type AddLeadFormValues = z.infer<typeof addLeadSchema>;

export function AddLeadForm({
  onSave,
  onCancel,
}: {
  onSave: (data: AddLeadFormValues) => void;
  onCancel: () => void;
}) {
  const [companyOpen, setCompanyOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(staticCompanies);
  const [contactSearch, setContactSearch] = useState("");
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [totalValue, setTotalValue] = useState(0);


  const form = useForm<AddLeadFormValues>({
    resolver: zodResolver(addLeadSchema),
    defaultValues: {
      name: "",
      ownerId: "",
      status: "New",
      source: "",
      companyId: "",
      contactIds: [],
      primaryContactId: "",
      lineItems: [],
      convertToOpportunity: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems"
  });

  const selectedCompanyId = form.watch("companyId");
  const selectedContactIds = form.watch("contactIds");
  const lineItems = form.watch("lineItems");

  useEffect(() => {
    const newTotal = lineItems.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + (product ? product.price * item.quantity : 0);
    }, 0);
    setTotalValue(newTotal);
  }, [lineItems]);

  const availableContacts = selectedCompanyId
    ? contacts.filter((c) => c.companyId === selectedCompanyId)
    : [];

  const filteredContacts = availableContacts.filter(c => 
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(contactSearch.toLowerCase()) || 
    c.email.toLowerCase().includes(contactSearch.toLowerCase())
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

    // Manage primary contact
    if (!checked && currentPrimaryId === contactId) {
      // If the primary contact is unchecked, set new primary to the first of the remaining, or clear it
      form.setValue("primaryContactId", newContactIds[0] || "", { shouldValidate: true });
    } else if (checked && newContactIds.length === 1) {
      // If this is the first and only contact selected, make it primary
      form.setValue("primaryContactId", contactId, { shouldValidate: true });
    }
  };

  const handleCompanyCreated = (newCompany: Company) => {
    setCompanies(prev => [...prev, newCompany]);
    form.setValue("companyId", newCompany.id, { shouldValidate: true });
    setCompanyOpen(false);
  };
  
  const handleProductsAddedFromSelector = (newProductIds: string[]) => {
    const fieldProductIds = fields.map(f => f.productId);
    
    const productsToAdd = newProductIds
      .filter(id => !fieldProductIds.includes(id))
      .map(id => ({ productId: id, quantity: 1 }));
    
    if (productsToAdd.length > 0) {
      append(productsToAdd);
    }
    
    const indicesToRemove = fieldProductIds
      .map((id, index) => (newProductIds.includes(id) ? -1 : index))
      .filter(index => index !== -1);
      
    if (indicesToRemove.length > 0) {
      indicesToRemove.sort((a, b) => b - a).forEach(index => remove(index));
    }
  };

  const onSubmit = (values: AddLeadFormValues) => {
    onSave(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead</FormLabel>
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
              name="ownerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assigned to</FormLabel>
                   <Popover open={ownerOpen} onOpenChange={setOwnerOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? users.find((user) => user.id === field.value)?.name
                            : "Select owner"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search owner..." />
                        <CommandList>
                          <CommandEmpty>No owner found.</CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                value={user.name}
                                key={user.id}
                                onSelect={() => {
                                  form.setValue("ownerId", user.id, { shouldValidate: true });
                                  setOwnerOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    user.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {user.name}
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
                      <SelectItem value="Junk">Junk</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                      <CommandList>
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup>
                           <CommandItem
                            onSelect={() => {
                              setIsAddCompanyOpen(true);
                              setCompanyOpen(false);
                            }}
                            className="cursor-pointer"
                           >
                              <PlusCircle className="mr-2 h-4 w-4" />
                              <span>Add New Company</span>
                           </CommandItem>
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
                              id={`contact-${contact.id}`}
                              checked={selectedContactIds.includes(contact.id)}
                              onCheckedChange={(checked) => {
                                handleContactCheckedChange(!!checked, contact.id);
                              }}
                            />
                            <RadioGroupItem
                              value={contact.id}
                              id={`primary-${contact.id}`}
                              disabled={!selectedContactIds.includes(contact.id)}
                            />
                            <label
                                htmlFor={`primary-${contact.id}`}
                                className={cn(
                                  "flex w-full cursor-pointer items-center justify-between font-normal",
                                  !selectedContactIds.includes(contact.id) && "cursor-not-allowed opacity-50"
                                )}
                              >
                                <span>
                                  {contact.firstName} {contact.lastName}
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
            name="lineItems"
            render={() => (
                <FormItem>
                    <FormLabel>Products & Services</FormLabel>
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="w-[100px]">Quantity</TableHead>
                                    <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                                    <TableHead className="w-[120px] text-right">Total</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center h-24">
                                            No products added yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {fields.map((field, index) => {
                                    const product = products.find(p => p.id === field.productId);
                                    const price = product?.price ?? 0;
                                    const total = price * field.quantity;
                                    return (
                                        <TableRow key={field.id}>
                                            <TableCell className="font-medium">{product?.name}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    {...form.register(`lineItems.${index}.quantity`)}
                                                    className="h-8"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">₹{price.toLocaleString('en-IN')}</TableCell>
                                            <TableCell className="text-right">₹{total.toLocaleString('en-IN')}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                         <div className="p-2 flex items-center justify-between border-t">
                            <Button variant="outline" size="sm" type="button" onClick={() => setIsProductSelectorOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                             {fields.length > 0 && (
                                <div className="text-right font-medium pr-4">
                                    Total: <span className="text-lg font-bold">₹{totalValue.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                         </div>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="convertToOpportunity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-secondary/50">
                <div className="space-y-0.5">
                  <FormLabel>Create an Opportunity</FormLabel>
                  <FormDescription>
                    Also create a new opportunity for this lead in the pipeline.
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
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
      <AddCompanyDialog
        isOpen={isAddCompanyOpen}
        setIsOpen={setIsAddCompanyOpen}
        onCompanyCreated={handleCompanyCreated}
      />
      <ProductSelectorDialog
        isOpen={isProductSelectorOpen}
        setIsOpen={setIsProductSelectorOpen}
        onProductsAdded={handleProductsAddedFromSelector}
        initialSelectedIds={fields.map(f => f.productId)}
      />
    </>
  );
}
