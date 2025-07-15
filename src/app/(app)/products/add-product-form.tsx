
"use client";

import { useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const addProductSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  category: z.string().min(1, "Category is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  range: z.string().optional(),
  resolution: z.string().optional(),
  isNabl: z.boolean().default(false),
  location: z.enum(['Lab', 'Site', 'Both']),
});

export type AddProductFormValues = z.infer<typeof addProductSchema>;

const productCategories = [
  "Sensors",
  "Scales",
  "Tools",
  "Lab Equipment",
  "Weighing Machine Calibration Services",
  "Weight Calibration Services",
  "Electrical Instruments Calibration Services",
  "Dimensional Calibration Services",
  "Pressure Gauge and Vacuum Gauges Calibration Services",
  "Autoclave Calibration Services",
  "Flow Meter Calibration Services",
  "Tachometer & Sound Level Meter Calibration Services",
];

export function AddProductForm({
  onSave,
  onCancel,
}: {
  onSave: (data: AddProductFormValues) => void;
  onCancel: () => void;
}) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      range: "",
      resolution: "",
      isNabl: false,
      location: undefined,
    },
  });

  const onSubmit = (values: AddProductFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
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
                        ? productCategories.find(
                            (category) => category === field.value
                          )
                        : "Select a category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList className="max-h-52">
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {productCategories.map((category) => (
                          <CommandItem
                            value={category}
                            key={category}
                            onSelect={() => {
                              form.setValue("category", category, { shouldValidate: true });
                              setCategoryOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                category === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product/Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., On-site Industrial Scale Calibration" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="range"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Range</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., -80 to 250 C" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="resolution"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Resolution</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 0.1 C" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Lab">Lab</SelectItem>
                      <SelectItem value="Site">Site</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price (INR)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 15000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
         <FormField
            control={form.control}
            name="isNabl"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>NABL Accredited</FormLabel>
                  <FormDescription>
                    Is this service NABL accredited?
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
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </Form>
  );
}

    