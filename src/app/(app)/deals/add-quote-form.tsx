
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

const addQuoteSchema = z.object({
  value: z.coerce.number().min(1, "Quote value is required."),
  expiryDate: z.string().min(1, "Expiry date is required."),
  document: z.any().optional(),
});

export type AddQuoteFormValues = z.infer<typeof addQuoteSchema>;

export function AddQuoteForm({
  onSave,
  onCancel,
}: {
  onSave: (data: AddQuoteFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<AddQuoteFormValues>({
    resolver: zodResolver(addQuoteSchema),
    defaultValues: {
      value: 0,
      expiryDate: "",
    },
  });

  const onSubmit = (values: AddQuoteFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote Value ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 50000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiryDate"
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
         <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attach Document</FormLabel>
              <FormControl>
                 <Input 
                    type="file"
                    onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                  />
              </FormControl>
              <FormDescription>Attach a PO or quote document.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Quote</Button>
        </div>
      </form>
    </Form>
  );
}
