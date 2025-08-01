
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

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
import { 
    salutations, 
    companies as staticCustomers, 
    type Company as Customer, 
    departments,
    jobTitles,
    contactNumberTypes,
    seniorities,
    educationalBackgrounds,
    ageGroups,
    genders,
    languages,
    digitalOpennessLevels
} from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddCustomerDialog } from "../customers/add-customer-dialog";


const addContactSchema = z.object({
  companyId: z.string().min(1, "Customer is required."),
  salutation: z.string().min(1, "Salutation is required.") as z.ZodSchema<'Mr.' | 'Ms.' | 'Mrs.' | 'Dr.'>,
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email."),
  mobile: z.string().min(1, "Mobile number is required."),
  contactNumberType: z.enum(contactNumberTypes).optional(),
  jobTitle: z.enum(jobTitles).optional(),
  department: z.string().min(1, "Department is required."),
  seniority: z.enum(seniorities).optional(),
  educationalBackground: z.enum(educationalBackgrounds).optional(),
  ageGroup: z.enum(ageGroups).optional(),
  gender: z.enum(genders).optional(),
  language: z.enum(languages).optional(),
  opennessToDigital: z.enum(digitalOpennessLevels).optional(),
});

export type AddContactFormValues = z.infer<typeof addContactSchema>;

export function AddContactForm({
  onSave,
  onCancel,
  companyId
}: {
  onSave: (data: AddContactFormValues) => void;
  onCancel: () => void;
  companyId?: string;
}) {
  const [customerOpen, setCustomerOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(staticCustomers);

  const form = useForm<AddContactFormValues>({
    resolver: zodResolver(addContactSchema),
    defaultValues: {
      companyId: companyId || "",
      salutation: undefined,
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      department: "",
    },
  });

  const handleCustomerCreated = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    form.setValue("companyId", newCustomer.id, { shouldValidate: true });
    setCustomerOpen(false);
  };

  const onSubmit = (values: AddContactFormValues) => {
    onSave(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 px-1">
           <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Customer</FormLabel>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")} disabled={!!companyId}>
                        {field.value ? customers.find((c) => c.id === field.value)?.name : "Select customer"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search customer..." />
                      <CommandList>
                        <CommandEmpty>No customer found.</CommandEmpty>
                         <CommandGroup>
                           <CommandItem onSelect={() => { setIsAddCustomerOpen(true); setCustomerOpen(false);}} className="cursor-pointer">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              <span>Add New Customer</span>
                           </CommandItem>
                          {customers.map((c) => (
                            <CommandItem value={c.name} key={c.id} onSelect={() => {form.setValue("companyId", c.id, { shouldValidate: true }); setCustomerOpen(false);}}>
                              <Check className={cn("mr-2 h-4 w-4", c.id === field.value ? "opacity-100" : "opacity-0")} />
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

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Salutation</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                    <SelectContent>
                      {salutations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl><Input placeholder="e.g., John" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="e.g., john.doe@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl><Input placeholder="e.g., 9876543210" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="contactNumberType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Number Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select number type" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {contactNumberTypes.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
                name="jobTitle"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select job title" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {jobTitles.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
                name="seniority"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Seniority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select seniority level" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {seniorities.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="educationalBackground"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Education</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select education" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {educationalBackgrounds.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
                name="ageGroup"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Age Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select age group" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {ageGroups.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {genders.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
                name="language"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {languages.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="opennessToDigital"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Digital Tool Openness</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {digitalOpennessLevels.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Contact</Button>
          </div>
        </form>
      </Form>
      <AddCustomerDialog
        isOpen={isAddCustomerOpen}
        setIsOpen={setIsAddCustomerOpen}
        onCustomerCreated={handleCustomerCreated}
      />
    </>
  );
}
