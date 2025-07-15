
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Company, firmographicSchema, companyIndustries, companySizes, ownershipTypes, businessStages, serviceDependencies, productPortfolios, annualSpends, decisionCycles, serviceExpectations, paymentCycles, paymentMethods, complaintFrequencies, certificateFormats, auditSupportOptions, willingnessToPayOptions, relationshipLengths, engagementLevels, loyaltyOptions, locationPreferences } from "@/lib/data";

export type EditCompanyFormValues = z.infer<typeof firmographicSchema>;

export function EditCompanyForm({
  company,
  onSave,
  onCancel,
}: {
  company: Company,
  onSave: (data: EditCompanyFormValues) => void;
  onCancel: () => void;
}) {
  const form = useForm<EditCompanyFormValues>({
    resolver: zodResolver(firmographicSchema),
    defaultValues: {
        name: company.name,
        industry: company.industry,
        website: company.website,
        address: company.address,
        companySize: company.companySize,
        numberOfEmployees: company.numberOfEmployees,
        location: company.location,
        ownershipType: company.ownershipType,
        stageOfBusiness: company.stageOfBusiness,
        accreditations: company.accreditations,
        serviceDependency: company.serviceDependency,
        productPortfolio: company.productPortfolio,
        annualSpend: company.annualSpend,
        decisionCycle: company.decisionCycle,
        serviceExpectations: company.serviceExpectations,
        preferences: company.preferences,
        paymentCycle: company.paymentCycle,
        paymentMethod: company.paymentMethod,
        complaints: company.complaints,
        certificateFormat: company.certificateFormat,
        auditSupport: company.auditSupport,
        willingnessToPay: company.willingnessToPay,
        lengthOfRelationship: company.lengthOfRelationship,
        levelOfEngagement: company.levelOfEngagement,
        loyalty: company.loyalty,
    },
  });

  const onSubmit = (values: EditCompanyFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <Accordion type="multiple" defaultValue={['basic-info']} className="w-full">
            <AccordionItem value="basic-info">
                <AccordionTrigger>Basic Information</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Company Name</FormLabel> <FormControl> <Input placeholder="e.g., Acme Corporation" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="industry" render={({ field }) => ( <FormItem> <FormLabel>Industry / Sector</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select an industry" /></SelectTrigger></FormControl> <SelectContent> {companyIndustries.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="website" render={({ field }) => ( <FormItem> <FormLabel>Website</FormLabel> <FormControl> <Input placeholder="https://example.com" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="location" render={({ field }) => ( <FormItem> <FormLabel>Location / Region</FormLabel> <FormControl> <Input placeholder="State, City, Industrial cluster, Zone" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Full Address</FormLabel> <FormControl> <Textarea placeholder="123 Main St, Anytown, USA 12345" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="organizational-profile">
                <AccordionTrigger>Organizational Profile</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="companySize" render={({ field }) => ( <FormItem> <FormLabel>Company Size / Turnover</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger></FormControl> <SelectContent>{companySizes.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="numberOfEmployees" render={({ field }) => ( <FormItem> <FormLabel>Number of Employees</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger></FormControl> <SelectContent>{["<50", "50-200", "200+"].map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="ownershipType" render={({ field }) => ( <FormItem> <FormLabel>Ownership Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select ownership" /></SelectTrigger></FormControl> <SelectContent>{ownershipTypes.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="stageOfBusiness" render={({ field }) => ( <FormItem> <FormLabel>Stage of Business</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger></FormControl> <SelectContent>{businessStages.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    </div>
                     <FormField control={form.control} name="accreditations" render={({ field }) => ( <FormItem> <FormLabel>Accreditations / Standards</FormLabel> <FormControl> <Input placeholder="e.g., ISO 9001, ISO 17025" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="service-financial">
                <AccordionTrigger>Service & Financial Details</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="serviceDependency" render={({ field }) => ( <FormItem> <FormLabel>Service Dependency/Renewals</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select dependency" /></SelectTrigger></FormControl> <SelectContent>{serviceDependencies.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="productPortfolio" render={({ field }) => ( <FormItem> <FormLabel>Product/Service Portfolio</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select portfolio" /></SelectTrigger></FormControl> <SelectContent>{productPortfolios.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="annualSpend" render={({ field }) => ( <FormItem> <FormLabel>Annual Spend</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select spend level" /></SelectTrigger></FormControl> <SelectContent>{annualSpends.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="decisionCycle" render={({ field }) => ( <FormItem> <FormLabel>Decision Cycle</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select cycle" /></SelectTrigger></FormControl> <SelectContent>{decisionCycles.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="paymentCycle" render={({ field }) => ( <FormItem> <FormLabel>Payment Cycle</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select cycle" /></SelectTrigger></FormControl> <SelectContent>{paymentCycles.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="paymentMethod" render={({ field }) => ( <FormItem> <FormLabel>Payment Method</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger></FormControl> <SelectContent>{paymentMethods.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                     </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="customer-behavior">
                <AccordionTrigger>Customer Behavior & Preferences</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="serviceExpectations" render={({ field }) => ( <FormItem> <FormLabel>Service Expectations</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select expectation" /></SelectTrigger></FormControl> <SelectContent>{serviceExpectations.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="preferences" render={({ field }) => ( <FormItem> <FormLabel>Preferences</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select preference" /></SelectTrigger></FormControl> <SelectContent>{locationPreferences.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="complaints" render={({ field }) => ( <FormItem> <FormLabel>Complaints Frequency</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl> <SelectContent>{complaintFrequencies.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="certificateFormat" render={({ field }) => ( <FormItem> <FormLabel>Certificate Formats</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select value" /></SelectTrigger></FormControl> <SelectContent>{certificateFormats.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="auditSupport" render={({ field }) => ( <FormItem> <FormLabel>Audit Support</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select support level" /></SelectTrigger></FormControl> <SelectContent>{auditSupportOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="willingnessToPay" render={({ field }) => ( <FormItem> <FormLabel>Willingness to Pay Premium</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger></FormControl> <SelectContent>{willingnessToPayOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="relationship">
                <AccordionTrigger>Relationship</AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="lengthOfRelationship" render={({ field }) => ( <FormItem> <FormLabel>Length of Relationship</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select length" /></SelectTrigger></FormControl> <SelectContent>{relationshipLengths.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="levelOfEngagement" render={({ field }) => ( <FormItem> <FormLabel>Level of Engagement</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl> <SelectContent>{engagementLevels.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="loyalty" render={({ field }) => ( <FormItem> <FormLabel>Loyalty / Advocacy</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger></FormControl> <SelectContent>{loyaltyOptions.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
