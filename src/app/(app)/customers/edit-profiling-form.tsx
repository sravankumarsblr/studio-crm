
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
  type Company as Customer,
  ownershipTypes,
  businessStages,
  accreditationsStandards,
  serviceDependencies,
  productServicePortfolios,
  annualSpends,
  decisionCycles,
  serviceExpectations,
  preferences,
  paymentCycles,
  paymentMethods,
  usageProfiles,
  certificateFormats,
  auditSupportOptions,
  premiumServiceOptions,
  relationshipLengths,
  engagementLevels,
  loyaltyAdvocacyOptions,
} from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const editProfilingSchema = z.object({
  ownershipType: z.enum(ownershipTypes).optional(),
  businessStage: z.enum(businessStages).optional(),
  accreditations: z.array(z.enum(accreditationsStandards)).optional(),
  serviceDependency: z.enum(serviceDependencies).optional(),
  productServicePortfolio: z.enum(productServicePortfolios).optional(),
  annualSpend: z.enum(annualSpends).optional(),
  decisionCycle: z.enum(decisionCycles).optional(),
  serviceExpectations: z.enum(serviceExpectations).optional(),
  preferences: z.enum(preferences).optional(),
  paymentCycle: z.enum(paymentCycles).optional(),
  paymentMethod: z.enum(paymentMethods).optional(),
  usageProfile: z.enum(usageProfiles).optional(),
  certificateFormat: z.enum(certificateFormats).optional(),
  auditSupport: z.enum(auditSupportOptions).optional(),
  willingToPayPremium: z.enum(premiumServiceOptions).optional(),
  relationshipLength: z.enum(relationshipLengths).optional(),
  engagementLevel: z.enum(engagementLevels).optional(),
  loyaltyAdvocacy: z.array(z.enum(loyaltyAdvocacyOptions)).optional(),
});

export type EditProfilingFormValues = z.infer<typeof editProfilingSchema>;

export function EditProfilingForm({
  customer,
  onSave,
  onCancel,
}: {
  customer: Customer;
  onSave: (data: EditProfilingFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<EditProfilingFormValues>({
    resolver: zodResolver(editProfilingSchema),
    defaultValues: {
      ownershipType: customer.ownershipType,
      businessStage: customer.businessStage,
      accreditations: customer.accreditations || [],
      serviceDependency: customer.serviceDependency,
      productServicePortfolio: customer.productServicePortfolio,
      annualSpend: customer.annualSpend,
      decisionCycle: customer.decisionCycle,
      serviceExpectations: customer.serviceExpectations,
      preferences: customer.preferences,
      paymentCycle: customer.paymentCycle,
      paymentMethod: customer.paymentMethod,
      usageProfile: customer.usageProfile,
      certificateFormat: customer.certificateFormat,
      auditSupport: customer.auditSupport,
      willingToPayPremium: customer.willingToPayPremium,
      relationshipLength: customer.relationshipLength,
      engagementLevel: customer.engagementLevel,
      loyaltyAdvocacy: customer.loyaltyAdvocacy || [],
    },
  });

  const onSubmit = (values: EditProfilingFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <Tabs defaultValue="firmographic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="firmographic">Firmographic</TabsTrigger>
            <TabsTrigger value="behavioral">Behavioral & Relational</TabsTrigger>
          </TabsList>
          <TabsContent value="firmographic" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ownershipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ownership Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select ownership type" /></SelectTrigger></FormControl>
                      <SelectContent>{ownershipTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage of Business</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select business stage" /></SelectTrigger></FormControl>
                      <SelectContent>{businessStages.map(stage => <SelectItem key={stage} value={stage}>{stage}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceDependency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Dependency/Renewals</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select service dependency" /></SelectTrigger></FormControl>
                      <SelectContent>{serviceDependencies.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productServicePortfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Service Portfolio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select portfolio type" /></SelectTrigger></FormControl>
                      <SelectContent>{productServicePortfolios.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="annualSpend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Spend</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select annual spend category" /></SelectTrigger></FormControl>
                      <SelectContent>{annualSpends.map(spend => <SelectItem key={spend} value={spend}>{spend}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="accreditations"
                render={() => (
                  <FormItem className="mt-4">
                    <div className="mb-4"><FormLabel className="text-base">Accreditations / Standards</FormLabel><FormDescription>Select all applicable accreditations.</FormDescription></div>
                    <div className="grid grid-cols-3 gap-y-2">
                    {accreditationsStandards.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="accreditations"
                        render={({ field }) => {
                          return (
                            <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))}} /></FormControl>
                              <FormLabel className="font-normal">{item}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </TabsContent>
          <TabsContent value="behavioral" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="decisionCycle"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Decision Cycle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select decision cycle" /></SelectTrigger></FormControl>
                        <SelectContent>{decisionCycles.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="serviceExpectations"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Service Expectations</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select service expectation" /></SelectTrigger></FormControl>
                        <SelectContent>{serviceExpectations.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Preferences</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl>
                        <SelectContent>{preferences.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="paymentCycle"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Payment Cycle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select payment cycle" /></SelectTrigger></FormControl>
                        <SelectContent>{paymentCycles.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select payment method" /></SelectTrigger></FormControl>
                        <SelectContent>{paymentMethods.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="usageProfile"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Client Usage Profile</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select usage profile" /></SelectTrigger></FormControl>
                        <SelectContent>{usageProfiles.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="certificateFormat"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Certificate Formats</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select certificate format" /></SelectTrigger></FormControl>
                        <SelectContent>{certificateFormats.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="auditSupport"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Audit Support</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select audit support level" /></SelectTrigger></FormControl>
                        <SelectContent>{auditSupportOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="willingToPayPremium"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Willing to Pay Premium</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger></FormControl>
                        <SelectContent>{premiumServiceOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="relationshipLength"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Length of Relationship</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select relationship length" /></SelectTrigger></FormControl>
                        <SelectContent>{relationshipLengths.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="engagementLevel"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Level of Engagement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select engagement level" /></SelectTrigger></FormControl>
                        <SelectContent>{engagementLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select><FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="loyaltyAdvocacy"
              render={() => (
                <FormItem className="mt-4">
                  <div className="mb-4"><FormLabel className="text-base">Loyalty / Advocacy</FormLabel><FormDescription>Select all applicable loyalty indicators.</FormDescription></div>
                   <div className="grid grid-cols-3 gap-y-2">
                  {loyaltyAdvocacyOptions.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="loyaltyAdvocacy"
                      render={({ field }) => {
                        return (
                          <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))}}/></FormControl>
                            <FormLabel className="font-normal">{item}</FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
