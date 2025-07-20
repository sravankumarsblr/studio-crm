
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
import { Separator } from "@/components/ui/separator";

const addProductSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  category: z.string().min(1, "Level - 1 is required."),
  isNabl: z.boolean().default(false),
  location: z.enum(['Lab', 'Site', 'Site & Lab']),
  nablRange: z.string().optional(),
  nonNablRange: z.string().optional(),
  masterRange: z.string().optional(),
  nablPrice: z.coerce.number().optional(),
  nonNablPrice: z.coerce.number().optional(),
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
      nablPrice: 0,
      isNabl: false,
      location: undefined,
    },
  });

  const onSubmit = (values: AddProductFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Level - 1</FormLabel>
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
                          {field.value || "Select a level - 1"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search..." />
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <SelectItem value="Site & Lab">Site & Lab</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="isNabl"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm h-full mt-2">
                    <div className="space-y-0.5">
                      <FormLabel>NABL Accredited</FormLabel>
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
        </div>
        <Separator />
        <h4 className="font-medium text-sm">In-House Pricing & Range</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="nablRange"
              render={({ field }) => (
                  <FormItem><FormLabel>NABL Range</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nablPrice"
              render={({ field }) => (
                  <FormItem><FormLabel>NABL Price (INR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nonNablRange"
              render={({ field }) => (
                  <FormItem><FormLabel>Non-NABL Range</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nonNablPrice"
              render={({ field }) => (
                  <FormItem><FormLabel>Non-NABL Price (INR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="masterRange"
              render={({ field }) => (
                  <FormItem><FormLabel>Master Range</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
        </div>
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
