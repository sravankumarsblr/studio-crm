
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Quote } from "@/lib/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const poStatuses = ["Received", "Acceptance Mail", "On Phone"] as const;

const attachPoSchema = z.object({
  poNumber: z.string().min(1, "PO number is required."),
  poValue: z.coerce.number().positive("PO value must be positive."),
  poDate: z.string().min(1, "PO date is required."),
  poStatus: z.enum(poStatuses, { required_error: "PO Status is required."}),
  poDocument: z.any().optional(),
});

export type AttachPoFormValues = z.infer<typeof attachPoSchema>;

export function AttachPoForm({
  quote,
  onSave,
  onCancel,
}: {
  quote: Quote,
  onSave: (data: AttachPoFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<AttachPoFormValues>({
    resolver: zodResolver(attachPoSchema),
    defaultValues: {
      poNumber: "",
      poValue: undefined,
      poDate: "",
      poStatus: undefined,
    },
  });

  const onSubmit = (values: AttachPoFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="poNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Purchase Order Number</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., PO12345" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="poStatus"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>PO Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select PO Status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {poStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="poValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Value (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 50000" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="poDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>PO Date</FormLabel>
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
                          format(new Date(field.value), "PPP")
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
            name="poDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attach PO Document</FormLabel>
                <FormControl>
                  <Input 
                      type="file"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
                </FormControl>
                <FormDescription>Attach the customer's purchase order document.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Attach PO and Accept Quote</Button>
        </div>
      </form>
    </Form>
  );
}
