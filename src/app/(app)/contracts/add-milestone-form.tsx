
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { users } from "@/lib/data";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useState } from "react";

const addMilestoneSchema = z.object({
  name: z.string().min(1, "Milestone name is required."),
  dueDate: z.string().min(1, "Due date is required."),
  assignedToId: z.string().min(1, "Assignee is required."),
  amount: z.coerce.number().positive("Amount must be positive."),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
});

export type AddMilestoneFormValues = z.infer<typeof addMilestoneSchema>;

type AddMilestoneFormProps = {
  onSave: (data: AddMilestoneFormValues) => void;
  onCancel: () => void;
  contractValue: number;
  existingMilestoneTotal: number;
};

export function AddMilestoneForm({ onSave, onCancel, contractValue, existingMilestoneTotal }: AddMilestoneFormProps) {
  const [ownerOpen, setOwnerOpen] = useState(false);
  const remainingValue = contractValue - existingMilestoneTotal;

  const form = useForm<AddMilestoneFormValues>({
    resolver: zodResolver(addMilestoneSchema.refine(data => data.amount <= remainingValue, {
        message: `Amount cannot exceed the remaining contract value of ₹${remainingValue.toLocaleString('en-IN')}`,
        path: ['amount'],
    })),
    defaultValues: {
      name: "",
      dueDate: "",
      assignedToId: "",
      amount: '' as any,
      status: 'Pending',
    },
  });

  const onSubmit = (values: AddMilestoneFormValues) => {
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
              <FormLabel>Milestone</FormLabel>
              <FormControl><Input placeholder="e.g., Phase 1 Delivery" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₹)</FormLabel>
                <FormControl><Input type="number" placeholder="e.g., 50000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])} /></PopoverContent></Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="assignedToId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Assigned to</FormLabel>
              <Popover open={ownerOpen} onOpenChange={setOwnerOpen}><PopoverTrigger asChild><FormControl><Button variant="outline" role="combobox" className={cn("justify-between", !field.value && "text-muted-foreground")}>{field.value ? users.find((user) => user.id === field.value)?.name : "Select owner"}<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Search owner..." /><CommandList><CommandEmpty>No owner found.</CommandEmpty><CommandGroup>{users.map((user) => (<CommandItem value={user.name} key={user.id} onSelect={() => { form.setValue("assignedToId", user.id, { shouldValidate: true }); setOwnerOpen(false); }}><Check className={cn("mr-2 h-4 w-4", user.id === field.value ? "opacity-100" : "opacity-0")} />{user.name}</CommandItem>))}</CommandGroup></CommandList></Command></PopoverContent></Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground pt-2">Remaining allocatable value: ₹{remainingValue.toLocaleString('en-IN')}</p>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Milestone</Button>
        </div>
      </form>
    </Form>
  );
}
