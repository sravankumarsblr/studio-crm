
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, PlusCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { companies as staticCompanies, contacts, products, Company } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AddCompanyDialog } from "../companies/add-company-dialog";

const addOpportunitySchema = z.object({
  name: z.string().min(1, "Opportunity name is required."),
  stage: z.string().min(1, "Stage is required."),
  closeDate: z.string().min(1, "Close date is required"),
  companyId: z.string().min(1, "Company is required."),
  contactIds: z
    .array(z.string())
    .min(1, "You must select at least one contact."),
  primaryContactId: z.string().optional(),
  productIds: z
    .array(z.string())
    .min(1, "You have to select at least one product."),
  // Quote fields
  quoteValue: z.coerce.number().min(1, "Quote value is required."),
  quoteExpiryDate: z.string().min(1, "Expiry date is required."),
  quoteDocument: z.any().optional(),
  discountType: z.enum(['none', 'percentage', 'fixed']).default('none'),
  discountValue: z.coerce.number().optional(),
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
).refine(data => {
    if (data.discountType !== 'none' && (!data.discountValue || data.discountValue <= 0)) {
        return false;
    }
    return true;
}, {
    message: "A positive discount value is required.",
    path: ["discountValue"],
});

export type AddOpportunityFormValues = z.infer<typeof addOpportunitySchema>;

export function AddOpportunityForm({
  onSave,
  onCancel,
}: {
  onSave: (data: AddOpportunityFormValues) => void;
  onCancel: () => void;
}) {
  const [companyOpen, setCompanyOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(staticCompanies);
  const [contactSearch, setContactSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const form = useForm<AddOpportunityFormValues>({
    resolver: zodResolver(addOpportunitySchema),
    defaultValues: {
      name: "",
      stage: "Qualification",
      closeDate: "",
      companyId: "",
      contactIds: [],
      primaryContactId: "",
      productIds: [],
      quoteValue: 0,
      quoteExpiryDate: "",
      discountType: 'none',
      discountValue: undefined,
    },
  });

  const selectedCompanyId = form.watch("companyId");
  const selectedContactIds = form.watch("contactIds");
  const discountType = form.watch("discountType");

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

  const handleCompanyCreated = (newCompany: Company) => {
    setCompanies(prev => [...prev, newCompany]);
    form.setValue("companyId", newCompany.id, { shouldValidate: true });
    setCompanyOpen(false);
  };

  const onSubmit = (values: AddOpportunityFormValues) => {
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
                <FormLabel>Opportunity Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Q4 Sensor Contract" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a stage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Qualification">Qualification</SelectItem>
                      <SelectItem value="Proposal">Proposal</SelectItem>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Closed Won">Closed Won</SelectItem>
                      <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="closeDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expected Close Date</FormLabel>
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
                            format(field.value, "PPP")
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

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Initial Quote Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quoteValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>List Value ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quoteExpiryDate"
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
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick an expiry date</span>
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
                          <FormLabel className="font-normal">Fixed ($)</FormLabel>
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
              name="quoteDocument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attach Document</FormLabel>
                  <FormControl>
                    <Input 
                        type="file"
                        onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                      />
                  </FormControl>
                  <FormDescription>Optionally attach a PO or quote document.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Opportunity</Button>
          </div>
        </form>
      </Form>
      <AddCompanyDialog
        isOpen={isAddCompanyOpen}
        setIsOpen={setIsAddCompanyOpen}
        onCompanyCreated={handleCompanyCreated}
      />
    </>
  );
}
