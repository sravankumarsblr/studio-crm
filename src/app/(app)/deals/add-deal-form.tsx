
"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, PlusCircle, CalendarIcon, Trash2 } from "lucide-react";
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
import { companies as staticCompanies, contacts, products, users, Company, LineItem } from "@/lib/data";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const addOpportunitySchema = z.object({
  name: z.string().min(1, "Opportunity name is required."),
  ownerId: z.string().min(1, "Deal owner is required."),
  stage: z.string().min(1, "Stage is required."),
  closeDate: z.string().min(1, "Close date is required"),
  companyId: z.string().min(1, "Company is required."),
  contactIds: z
    .array(z.string())
    .min(1, "You must select at least one contact."),
  primaryContactId: z.string().optional(),
  lineItems: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().min(1, "Qty must be at least 1."),
  })).min(1, "Please add at least one product."),
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

export type AddOpportunityFormValues = z.infer<typeof addOpportunitySchema>;

function ProductSelectorDialog({
  isOpen,
  setIsOpen,
  onProductsAdded
}: {
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
  onProductsAdded: (productIds: string[]) => void
}) {
  const [stagedProductIds, setStagedProductIds] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const productCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return ["All", ...Array.from(categories)];
  }, []);

  const availableProducts = useMemo(() => {
    return products.filter(p => {
        const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
        const searchMatch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
        return categoryMatch && searchMatch;
    });
  }, [selectedCategory, productSearch]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return availableProducts.slice(startIndex, startIndex + productsPerPage);
  }, [availableProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(availableProducts.length / productsPerPage);

  const handleToggleStagedProduct = (productId: string) => {
    setStagedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const handleAddProducts = () => {
    onProductsAdded(stagedProductIds);
    setIsOpen(false);
    setStagedProductIds([]);
    setProductSearch("");
    setSelectedCategory("All");
    setCurrentPage(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Products</DialogTitle>
          <DialogDescription>
            Select products to add to the opportunity. You can filter by category and search by name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-6 flex-1 overflow-hidden">
          <div className="col-span-1 border-r pr-4 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-1">
              {productCategories.map(category => (
                <div key={category} className="flex items-center">
                  <RadioGroupItem value={category} id={`cat-${category}`} />
                  <Label htmlFor={`cat-${category}`} className="ml-2 text-sm font-normal">{category}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
            <Input 
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox 
                          checked={stagedProductIds.includes(product.id)}
                          onCheckedChange={() => handleToggleStagedProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">₹{product.price.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</Button>
                <span className="text-sm">Page {currentPage} of {totalPages > 0 ? totalPages : 1}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProducts}>Add {stagedProductIds.length} Products</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function AddOpportunityForm({
  onSave,
  onCancel,
}: {
  onSave: (data: AddOpportunityFormValues) => void;
  onCancel: () => void;
}) {
  const [companyOpen, setCompanyOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(staticCompanies);
  const [contactSearch, setContactSearch] = useState("");
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [totalValue, setTotalValue] = useState(0);


  const form = useForm<AddOpportunityFormValues>({
    resolver: zodResolver(addOpportunitySchema),
    defaultValues: {
      name: "",
      stage: "Qualification",
      ownerId: "",
      closeDate: "",
      companyId: "",
      contactIds: [],
      primaryContactId: "",
      lineItems: [],
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
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) || 
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

  const handleProductsAddedFromSelector = (newProductIds: string[]) => {
    const currentProductIds = fields.map(f => f.productId);
    const productsToAdd = newProductIds.filter(id => !currentProductIds.includes(id));
    productsToAdd.forEach(id => {
      append({ productId: id, quantity: 1 });
    });
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            name="lineItems"
            render={() => (
                <FormItem>
                    <FormLabel>Products & Services</FormLabel>
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="w-[100px]">Qty</TableHead>
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
                         <div className="p-2 flex items-center justify-between">
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
      <ProductSelectorDialog
        isOpen={isProductSelectorOpen}
        setIsOpen={setIsProductSelectorOpen}
        onProductsAdded={handleProductsAddedFromSelector}
      />
    </>
  );
}
