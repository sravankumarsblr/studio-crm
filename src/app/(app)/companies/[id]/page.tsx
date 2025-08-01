
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Building, Users, Globe, ExternalLink, Edit, Workflow, Clock, ShieldCheck, HeartHandshake, Box, Sigma, Sparkles, Banknote, CalendarDays, Wallet, Ear, FileArchive, HelpCircle, Star, Handshake, Mail } from 'lucide-react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { companies, contacts as allContacts, opportunities as allOpportunities, leads as allLeads, type Company, type Contact, type Opportunity, type Lead } from '@/lib/data';
import { EditCompanyDialog } from '../edit-company-dialog';
import { EditProfilingDialog } from '../edit-profiling-dialog';
import { Separator } from '@/components/ui/separator';

const InfoCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-5 h-5 mt-1 text-muted-foreground" />
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="text-base font-medium">{children}</div>
        </div>
    </div>
);

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | undefined>(() => companies.find(c => c.id === companyId));
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false);
  const [isEditProfilingOpen, setIsEditProfilingOpen] = useState(false);

  const contacts = allContacts.filter(c => c.companyId === companyId);
  const opportunities = allOpportunities.filter(o => o.companyName === company?.name);
  const leads = allLeads.filter(l => l.companyName === company?.name);

  const handleCompanyUpdated = (updatedCompany: Company) => {
    setCompany(updatedCompany);
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Company not found.</p>
      </div>
    );
  }

  return (
    <>
        <div className="flex flex-col h-full">
            <Header title="">
                <div className="flex items-center gap-2 mr-auto">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/companies')}>
                        <ArrowLeft />
                    </Button>
                    <Image src={company.logo} alt={company.name} width={40} height={40} className="rounded-md" data-ai-hint="logo" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground font-headline">{company.name}</h1>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => setIsEditCompanyOpen(true)}><Edit className="mr-2"/> Edit Basic Info</Button>
            </Header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Tabs defaultValue="overview">
                    <TabsList className="mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="profiling">Profiling</TabsTrigger>
                        <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
                        <TabsTrigger value="deals">Deals ({opportunities.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                       <Card>
                            <CardHeader>
                                <CardTitle>Company Overview</CardTitle>
                                <CardDescription>Key information about {company.name}.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InfoCard icon={Building} title="Industry">{company.industry}</InfoCard>
                                <InfoCard icon={Users} title="Employees">{company.numberOfEmployees}</InfoCard>
                                <InfoCard icon={Globe} title="Website">
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                        {company.website} <ExternalLink className="w-3 h-3"/>
                                    </a>
                                </InfoCard>
                            </CardContent>
                       </Card>
                    </TabsContent>

                    <TabsContent value="profiling">
                       <Card>
                            <CardHeader className="flex-row justify-between items-start">
                                <div>
                                    <CardTitle>Company Profiling</CardTitle>
                                    <CardDescription>Detailed classification and behavioral information.</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setIsEditProfilingOpen(true)}><Edit className="mr-2 h-4 w-4"/>Edit Profiling</Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-4">Firmographic</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <InfoCard icon={Building} title="Ownership Type">{company.ownershipType || 'N/A'}</InfoCard>
                                        <InfoCard icon={Workflow} title="Stage of Business">{company.businessStage || 'N/A'}</InfoCard>
                                        <InfoCard icon={Box} title="Product/Service Portfolio">{company.productServicePortfolio || 'N/A'}</InfoCard>
                                        <InfoCard icon={HeartHandshake} title="Service Dependency/Renewals">{company.serviceDependency || 'N/A'}</InfoCard>
                                        <InfoCard icon={Sigma} title="Annual Spend Category">{company.annualSpend || 'N/A'}</InfoCard>
                                        <InfoCard icon={ShieldCheck} title="Accreditations">
                                            <div className="flex flex-wrap gap-2">
                                                {company.accreditations?.length ? company.accreditations.map(acc => <Badge key={acc} variant="secondary">{acc}</Badge>) : 'N/A'}
                                            </div>
                                        </InfoCard>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold mb-4">Behavioral & Relational</h4>
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <InfoCard icon={Clock} title="Decision Cycle">{company.decisionCycle || 'N/A'}</InfoCard>
                                        <InfoCard icon={Sparkles} title="Service Expectations">{company.serviceExpectations || 'N/A'}</InfoCard>
                                        <InfoCard icon={Wallet} title="Preferences">{company.preferences || 'N/A'}</InfoCard>
                                        <InfoCard icon={CalendarDays} title="Payment Cycle">{company.paymentCycle || 'N/A'}</InfoCard>
                                        <InfoCard icon={Banknote} title="Payment Method">{company.paymentMethod || 'N/A'}</InfoCard>
                                        <InfoCard icon={Ear} title="Usage Profile">{company.usageProfile || 'N/A'}</InfoCard>
                                        <InfoCard icon={FileArchive} title="Certificate Formats">{company.certificateFormat || 'N/A'}</InfoCard>
                                        <InfoCard icon={HelpCircle} title="Audit Support">{company.auditSupport || 'N/A'}</InfoCard>
                                        <InfoCard icon={Star} title="Willingness to Pay Premium">{company.willingToPayPremium || 'N/A'}</InfoCard>
                                        <InfoCard icon={Handshake} title="Length of Relationship">{company.relationshipLength || 'N/A'}</InfoCard>
                                        <InfoCard icon={Mail} title="Level of Engagement">{company.engagementLevel || 'N/A'}</InfoCard>
                                        <InfoCard icon={Users} title="Loyalty / Advocacy">
                                            <div className="flex flex-wrap gap-2">
                                                {company.loyaltyAdvocacy?.length ? company.loyaltyAdvocacy.map(item => <Badge key={item} variant="secondary">{item}</Badge>) : 'N/A'}
                                            </div>
                                        </InfoCard>
                                    </div>
                                </div>
                            </CardContent>
                       </Card>
                    </TabsContent>
                    
                    <TabsContent value="contacts">
                       <Card>
                            <CardHeader><CardTitle>Contacts at {company.name}</CardTitle></CardHeader>
                            <CardContent>
                                {/* Contacts Table/List Here */}
                                <p>Contacts list coming soon.</p>
                            </CardContent>
                       </Card>
                    </TabsContent>

                     <TabsContent value="deals">
                       <Card>
                            <CardHeader><CardTitle>Deals with {company.name}</CardTitle></CardHeader>
                            <CardContent>
                                {/* Deals Table/List Here */}
                                <p>Deals list coming soon.</p>
                            </CardContent>
                       </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
        
        <EditCompanyDialog 
            isOpen={isEditCompanyOpen}
            setIsOpen={setIsEditCompanyOpen}
            company={company}
            onCompanyUpdated={handleCompanyUpdated}
        />
        <EditProfilingDialog
            isOpen={isEditProfilingOpen}
            setIsOpen={setIsEditProfilingOpen}
            company={company}
            onCompanyUpdated={handleCompanyUpdated}
        />
    </>
  );
}
