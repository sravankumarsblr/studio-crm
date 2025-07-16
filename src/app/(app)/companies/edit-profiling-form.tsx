
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  type Company,
  ownershipTypes,
  businessStages,
  accreditationsStandards,
  serviceDependencies,
  productServicePortfolios,
  annualSpends
} from "@/lib/data";

const editProfilingSchema = z.object({
  ownershipType: z.enum(ownershipTypes).optional(),
  businessStage: z.enum(businessStages).optional(),
  accreditations: z.array(z.enum(accreditationsStandards)).optional(),
  serviceDependency: z.enum(serviceDependencies).optional(),
  productServicePortfolio: z.enum(productServicePortfolios).optional(),
  annualSpend: z.enum(annualSpends).optional(),
});

export type EditProfilingFormValues = z.infer<typeof editProfilingSchema>;

export function EditProfilingForm({
  company,
  onSave,
  onCancel,
}: {
  company: Company;
  onSave: (data: EditProfilingFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<EditProfilingFormValues>({
    resolver: zodResolver(editProfilingSchema),
    defaultValues: {
      ownershipType: company.ownershipType,
      businessStage: company.businessStage,
      accreditations: company.accreditations || [],
      serviceDependency: company.serviceDependency,
      productServicePortfolio: company.productServicePortfolio,
      annualSpend: company.annualSpend,
    },
  });

  const onSubmit = (values: EditProfilingFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <FormField
          control={form.control}
          name="ownershipType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ownership Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select ownership type" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ownershipTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="businessStage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage of Business</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select business stage" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {businessStages.map(stage => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serviceDependency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Dependency/Renewals</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select service dependency" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {serviceDependencies.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="productServicePortfolio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product/Service Portfolio</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select portfolio type" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productServicePortfolios.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="annualSpend"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Spend</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select annual spend category" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {annualSpends.map(spend => <SelectItem key={spend} value={spend}>{spend}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="accreditations"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Accreditations / Standards</FormLabel>
                <FormDescription>
                  Select all applicable accreditations.
                </FormDescription>
              </div>
              {accreditationsStandards.map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name="accreditations"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), item])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
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
