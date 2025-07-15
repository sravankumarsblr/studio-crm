
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Building2, Globe, Users, MapPin, BadgeInfo, Scale, Briefcase, Calendar, Star, TrendingUp, CheckCircle, Clock, Search, Phone, Mail, HandCoins, CreditCard, AlertTriangle, FileText, ShieldCheck, Award, Smile, Handshake, MessageCircle, Heart } from 'lucide-react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { companies, leads, opportunities, contracts } from '@/lib/data';
import { EditCompanyDialog } from '../edit-company-dialog';
import type { Company } from '@/lib/data';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

const InfoCard = ({ title, value, icon: Icon }: { title: string, value: string | number | undefined, icon: React.ElementType }) => (
    <div className="flex items-start gap-4">
        <Icon className="h-5 w-5 text-muted-foreground mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-sm font-medium">{value || 'N/A'}</p>
        </div>
    </div>
);

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;
  
  const [company, setCompany] = useState(() => companies.find((c) => c.id === companyId));
  const [isEditOpen, setIsEditOpen] = useState(false);

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

  const companyLeads = leads.filter(l => l.companyName === company.name);
  const companyOpportunities = opportunities.filter(o => o.companyName === company.name);
  const companyContracts = contracts.filter(c => c.companyName === company.name);


  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="">
            <div className="flex items-center gap-2 mr-auto">
                <Button variant="ghost" size="icon" onClick={() => router.push('/companies')}>
                    <ArrowLeft />
                </Button>
                <div className="flex items-center gap-4">
                    <Image src={company.logo} alt={company.name} width={40} height={40} className="rounded-md" data-ai-hint="logo" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground font-headline">{company.name}</h1>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                    </div>
                </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditOpen(true)}><Edit className="mr-2"/> Edit Profile</Button>
        </Header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Company Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-2xl font-bold">{companyLeads.length}</p>
                                <p className="text-sm text-muted-foreground">Leads</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{companyOpportunities.length}</p>
                                <p className="text-sm text-muted-foreground">Opps</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{companyContracts.length}</p>
                                <p className="text-sm text-muted-foreground">Contracts</p>
                            </div>
                        </div>
                        <Separator />
                        <div className="text-sm space-y-2">
                             <div className="flex justify-between"><span>Status</span> <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>{company.status}</Badge></div>
                             <div className="flex justify-between"><span>Website</span> <a href={company.website} target="_blank" className="text-primary hover:underline">{company.website}</a></div>
                             <div className="flex justify-between"><span>Address</span> <span>{company.address}</span></div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Firmographic Profile</CardTitle>
                        <CardDescription>Detailed company information for targeted engagement.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                        {/* Organizational Profile */}
                        <InfoCard title="Industry / Sector" value={company.industry} icon={Building2} />
                        <InfoCard title="Company Size / Turnover" value={company.companySize} icon={Scale} />
                        <InfoCard title="Number of Employees" value={company.numberOfEmployees} icon={Users} />
                        <InfoCard title="Location / Region" value={company.location} icon={MapPin} />
                        <InfoCard title="Ownership Type" value={company.ownershipType} icon={BadgeInfo} />
                        <InfoCard title="Stage of Business" value={company.stageOfBusiness} icon={TrendingUp} />
                        <InfoCard title="Accreditations" value={company.accreditations} icon={Award} />
                        
                        {/* Service & Financials */}
                        <InfoCard title="Service Dependency" value={company.serviceDependency} icon={Calendar} />
                        <InfoCard title="Product Portfolio" value={company.productPortfolio} icon={Briefcase} />
                        <InfoCard title="Annual Spend" value={company.annualSpend} icon={HandCoins} />
                        <InfoCard title="Decision Cycle" value={company.decisionCycle} icon={Clock} />
                        <InfoCard title="Payment Cycle" value={company.paymentCycle} icon={CreditCard} />
                        <InfoCard title="Payment Method" value={company.paymentMethod} icon={FileText} />
                        
                        {/* Behavior & Preferences */}
                        <InfoCard title="Service Expectations" value={company.serviceExpectations} icon={Star} />
                        <InfoCard title="Service Preferences" value={company.preferences} icon={ShieldCheck} />
                        <InfoCard title="Complaint Frequency" value={company.complaints} icon={AlertTriangle} />
                        <InfoCard title="Certificate Format" value={company.certificateFormat} icon={FileText} />
                        <InfoCard title="Audit Support" value={company.auditSupport} icon={Search} />
                        <InfoCard title="Willing to Pay Premium" value={company.willingnessToPay} icon={CheckCircle} />

                        {/* Relationship */}
                        <InfoCard title="Length of Relationship" value={company.lengthOfRelationship} icon={Handshake} />
                        <InfoCard title="Level of Engagement" value={company.levelOfEngagement} icon={MessageCircle} />
                        <InfoCard title="Loyalty / Advocacy" value={company.loyalty} icon={Heart} />
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>

       {company && (
        <EditCompanyDialog
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            company={company}
            onCompanyUpdated={handleCompanyUpdated}
        />
      )}
    </>
  );
}
