
"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { companies as staticCompanies, contacts, products, users, Lead, Company } from "@/lib/data";
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
import { AddCompanyDialog } from "../companies/add-company-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const editLeadSchema = z.object({
  name: z.string().min(1, "Lead name is required."),
  ownerId: z.string().min(1, "Lead owner is required."),
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
            Select products to add to the lead. You can filter by category and search by name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-6 flex-1 overflow-hidden">
          <div className="col-span-1 border-r pr-4 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-1">
              {productCategories.map(category => (
                <div key={category} className="flex items-center">
                  <RadioGroupItem value={category} id={`cat-edit-${category}`} />
                  <Label htmlFor={`cat-edit-${category}`} className="ml-2 text-sm font-normal">{category}</Label>
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
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(staticCompanies);
  const [contactSearch, setContactSearch] = useState("");
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);

  const defaultValues = useMemo(() => {
    const company = companies.find(c => c.name === lead.companyName);
    const primaryContact = contacts.find(c => c.name === lead.contactName && c.companyId === company?.id);

    return {
      name: lead.name,
      value: lead.value,
      ownerId: lead.ownerId,
      status: lead.status,
      source: lead.source,
      companyId: company?.id || "",
      contactIds: primaryContact ? [primaryContact.id] : [],
      primaryContactId: primaryContact?.id || "",
      productIds: lead.productIds || [],
      convertToDeal: false,
    };
  }, [lead, companies]);

  const form = useForm<EditLeadFormValues>({
    resolver: zodResolver(editLeadSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const selectedCompanyId = form.watch("companyId");
  const selectedContactIds = form.watch("contactIds");
  const selectedProductIds = form.watch("productIds");

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
  
  const handleProductRemove = (productId: string) => {
    const currentProductIds = form.getValues("productIds");
    form.setValue(
        "productIds",
        currentProductIds.filter(id => id !== productId),
        { shouldValidate: true }
    );
  };

  const handleProductsAddedFromSelector = (newProductIds: string[]) => {
    const currentProductIds = form.getValues("productIds");
    const mergedIds = Array.from(new Set([...currentProductIds, ...newProductIds]));
    form.setValue("productIds", mergedIds, { shouldValidate: true });
  }

  const onSubmit = (values: EditLeadFormValues) => {
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                    <div className="rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedProductIds.length > 0 ? (
                                    selectedProductIds.map((id) => {
                                        const product = products.find(p => p.id === id);
                                        if (!product) return null;
                                        return (
                                            <TableRow key={id}>
                                                <TableCell className="font-medium">{product.name}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" onClick={() => handleProductRemove(id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                        No products selected.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                         <div className="p-2 flex items-center justify-between">
                            <Button variant="outline" size="sm" type="button" onClick={() => setIsProductSelectorOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                         </div>
                    </div>
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
