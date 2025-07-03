
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";

import { cn } from "@/lib/utils";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Contract } from "@/lib/data";
import { users } from "@/lib/data";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const editContractSchema = z.object({
  contractTitle: z.string().min(1, "Contract title is required."),
  ownerId: z.string().min(1, "Owner is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().min(1, "End date is required."),
  effectiveDate: z.string().min(1, "Effective date is required."),
  status: z.string().min(1, "Status is required."),
  type: z.string().min(1, "Contract type is required."),
  scopeOfWork: z.string().min(1, "Scope of work is required."),
  document: z.any().optional(),
});

export type EditContractFormValues = z.infer<typeof editContractSchema>;

export function EditContractForm({
  contract,
  onSave,
  onCancel,
}: {
  contract: Contract;
  onSave: (data: EditContractFormValues) => void;
  onCancel: () => void;
}) {
  const [ownerOpen, setOwnerOpen] = useState(false);

  const creatorName = useMemo(() => {
    return users.find(u => u.id === contract.createdById)?.name || "Unknown";
  }, [contract.createdById]);

  const form = useForm<EditContractFormValues>({
    resolver: zodResolver(editContractSchema),
    defaultValues: {
      contractTitle: contract.contractTitle,
      ownerId: contract.ownerId,
      startDate: contract.startDate,
      endDate: contract.endDate,
      effectiveDate: contract.effectiveDate,
      status: contract.status,
      type: contract.type,
      scopeOfWork: contract.scopeOfWork,
      document: undefined,
    },
  });

  const onSubmit = (values: EditContractFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
        <FormField
          control={form.control}
          name="contractTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Title</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assigned to</FormLabel>
                   <Popover open={ownerOpen} onOpenChange={setOwnerOpen}><PopoverTrigger asChild><FormControl><Button variant="outline" role="combobox" className={cn("justify-between", !field.value && "text-muted-foreground")}>{field.value ? users.find((user) => user.id === field.value)?.name : "Select owner"}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Search owner..." /><CommandList><CommandEmpty>No owner found.</CommandEmpty><CommandGroup>{users.map((user) => (<CommandItem value={user.name} key={user.id} onSelect={() => { form.setValue("ownerId", user.id, { shouldValidate: true }); setOwnerOpen(false); }}><Check className={cn("mr-2 h-4 w-4", user.id === field.value ? "opacity-100" : "opacity-0")} />{user.name}</CommandItem>))}</CommandGroup></CommandList></Command></PopoverContent></Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Created By</FormLabel>
                <FormControl>
                    <Input value={creatorName} disabled />
                </FormControl>
            </FormItem>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Terminated">Terminated</SelectItem>
                      <SelectItem value="Renewed">Renewed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="Retainer">Retainer</SelectItem>
                      <SelectItem value="SLA">SLA</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn(!field.value && "text-muted-foreground")}>{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])} /></PopoverContent></Popover>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn(!field.value && "text-muted-foreground")}>{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])} /></PopoverContent></Popover>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="effectiveDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Effective Date</FormLabel>
                    <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn(!field.value && "text-muted-foreground")}>{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])} /></PopoverContent></Popover>
                    <FormMessage />
                  </FormItem>
                )}
            />
        </div>
        <FormField
          control={form.control}
          name="scopeOfWork"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scope of Work</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the scope of work..." {...field} className="min-h-[150px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="document"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Contract Document (PDF)</FormLabel>
              {contract.documentName && !value && <p className="text-sm text-muted-foreground">Current file: {contract.documentName}</p>}
              <FormControl>
                <Input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)}
                  {...rest}
                />
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
