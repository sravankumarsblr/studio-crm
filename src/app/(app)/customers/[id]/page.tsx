
"use client";

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Building, Users, Globe, ExternalLink, Edit, Workflow, Clock, ShieldCheck, HeartHandshake, Box, Sigma, Sparkles, Banknote, CalendarDays, Wallet, Ear, FileArchive, HelpCircle, Star, Handshake, Mail, PlusCircle } from 'lucide-react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { companies as allCustomers, contacts as allContacts, opportunities as allOpportunities, contracts as allContracts, type Company as Customer, type Contact, type Opportunity, type Contract, type Invoice } from '@/lib/data';
import { EditCustomerDialog } from '../edit-customer-dialog';
import { EditProfilingDialog } from '../edit-profiling-dialog';
import { Separator } from '@/components/ui/separator';
import { AddContactDialog } from '@/app/(app)/contacts/add-contact-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const InfoCard = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-5 h-5 mt-1 text-muted-foreground" />
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="text-base font-medium">{children}</div>
        </div>
    </div>
);

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | undefined>(() => allCustomers.find(c => c.id === customerId));
  const [isEditCustomerOpen, setIsEditCustomerOpen] = useState(false);
  const [isEditProfilingOpen, setIsEditProfilingOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(() => allContacts.filter(c => c.companyId === customerId));

  const opportunities = allOpportunities.filter(o => o.companyName === customer?.name);
  const contracts = allContracts.filter(c => c.companyName === customer?.name);
  const invoices = useMemo(() => {
    return contracts.flatMap(contract => 
      contract.milestones.flatMap(milestone => 
        milestone.invoices.map(invoice => ({
          ...invoice,
          contractId: contract.id,
          contractTitle: contract.contractTitle,
        }))
      )
    );
  }, [contracts]);

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomer(updatedCustomer);
  }

  const handleContactAdded = (newContact: Omit<Contact, 'id' | 'status' | 'avatar'>) => {
    const contactToAdd: Contact = {
        ...newContact,
        id: `con${new Date().getTime()}`,
        status: "active",
        avatar: "https://placehold.co/32x32.png",
    };
    setContacts(prev => [...prev, contactToAdd]);
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Customer not found.</p>
      </div>
    );
  }
  
  const getOpportunityStatusVariant = (status: Opportunity['status']) => {
    if (status === 'Won') return 'default';
    if (status === 'Lost') return 'destructive';
    if (status === 'New') return 'outline';
    return 'secondary';
  };
  
  const getContractStatusVariant = (status: Contract['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Renewed': return 'default';
      case 'Draft': return 'secondary';
      case 'Terminated': return 'destructive';
      case 'Expired': return 'outline';
      default: return 'outline';
    }
  };
  
  const getInvoiceStatusVariant = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Invoiced': return 'secondary';
      case 'Overdue': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <>
        <div className="flex flex-col h-full">
            <Header title="">
                <div className="flex items-center gap-4 mr-auto">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/customers')}>
                        <ArrowLeft />
                    </Button>
                    <Image src={customer.logo} alt={customer.name} width={40} height={40} className="rounded-md" data-ai-hint="logo" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground font-headline">{customer.name}</h1>
                        <p className="text-sm text-muted-foreground">{customer.industry}</p>
                    </div>
                </div>
                <Button variant="outline" onClick={() => setIsAddContactOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/> New Contact</Button>
                <Button variant="outline" onClick={() => setIsEditCustomerOpen(true)}><Edit className="mr-2"/> Edit Basic Info</Button>
            </Header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Tabs defaultValue="overview">
                    <TabsList className="mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="profiling">Profiling</TabsTrigger>
                        <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
                        <TabsTrigger value="opportunities">Opportunities ({opportunities.length})</TabsTrigger>
                        <TabsTrigger value="contracts">Contracts ({contracts.length})</TabsTrigger>
                        <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                       <Card>
                            <CardHeader>
                                <CardTitle>Customer Overview</CardTitle>
                                <CardDescription>Key information about {customer.name}.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InfoCard icon={Building} title="Industry">{customer.industry}</InfoCard>
                                <InfoCard icon={Users} title="Employees">{customer.numberOfEmployees}</InfoCard>
                                <InfoCard icon={Globe} title="Website">
                                    <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                        {customer.website} <ExternalLink className="w-3 h-3"/>
                                    </a>
                                </InfoCard>
                            </CardContent>
                       </Card>
                    </TabsContent>

                    <TabsContent value="profiling">
                       <Card>
                            <CardHeader className="flex-row justify-between items-start">
                                <div>
                                    <CardTitle>Customer Profiling</CardTitle>
                                    <CardDescription>Detailed classification and behavioral information.</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setIsEditProfilingOpen(true)}><Edit className="mr-2 h-4 w-4"/>Edit Profiling</Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-4">Firmographic</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <InfoCard icon={Building} title="Ownership Type">{customer.ownershipType || 'N/A'}</InfoCard>
                                        <InfoCard icon={Workflow} title="Stage of Business">{customer.businessStage || 'N/A'}</InfoCard>
                                        <InfoCard icon={Box} title="Product/Service Portfolio">{customer.productServicePortfolio || 'N/A'}</InfoCard>
                                        <InfoCard icon={HeartHandshake} title="Service Dependency/Renewals">{customer.serviceDependency || 'N/A'}</InfoCard>
                                        <InfoCard icon={Sigma} title="Annual Spend Category">{customer.annualSpend || 'N/A'}</InfoCard>
                                        <InfoCard icon={ShieldCheck} title="Accreditations">
                                            <div className="flex flex-wrap gap-2">
                                                {customer.accreditations?.length ? customer.accreditations.map(acc => <Badge key={acc} variant="secondary">{acc}</Badge>) : 'N/A'}
                                            </div>
                                        </InfoCard>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h4 className="font-semibold mb-4">Behavioral & Relational</h4>
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <InfoCard icon={Clock} title="Decision Cycle">{customer.decisionCycle || 'N/A'}</InfoCard>
                                        <InfoCard icon={Sparkles} title="Service Expectations">{customer.serviceExpectations || 'N/A'}</InfoCard>
                                        <InfoCard icon={Wallet} title="Preferences">{customer.preferences || 'N/A'}</InfoCard>
                                        <InfoCard icon={CalendarDays} title="Payment Cycle">{customer.paymentCycle || 'N/A'}</InfoCard>
                                        <InfoCard icon={Banknote} title="Payment Method">{customer.paymentMethod || 'N/A'}</InfoCard>
                                        <InfoCard icon={Ear} title="Usage Profile">{customer.usageProfile || 'N/A'}</InfoCard>
                                        <InfoCard icon={FileArchive} title="Certificate Formats">{customer.certificateFormat || 'N/A'}</InfoCard>
                                        <InfoCard icon={HelpCircle} title="Audit Support">{customer.auditSupport || 'N/A'}</InfoCard>
                                        <InfoCard icon={Star} title="Willingness to Pay Premium">{customer.willingToPayPremium || 'N/A'}</InfoCard>
                                        <InfoCard icon={Handshake} title="Length of Relationship">{customer.relationshipLength || 'N/A'}</InfoCard>
                                        <InfoCard icon={Mail} title="Level of Engagement">{customer.engagementLevel || 'N/A'}</InfoCard>
                                        <InfoCard icon={Users} title="Loyalty / Advocacy">
                                            <div className="flex flex-wrap gap-2">
                                                {customer.loyaltyAdvocacy?.length ? customer.loyaltyAdvocacy.map(item => <Badge key={item} variant="secondary">{item}</Badge>) : 'N/A'}
                                            </div>
                                        </InfoCard>
                                    </div>
                                </div>
                            </CardContent>
                       </Card>
                    </TabsContent>
                    
                    <TabsContent value="contacts">
                       <Card>
                            <CardHeader><CardTitle>Contacts at {customer.name}</CardTitle></CardHeader>
                            <CardContent>
                                {/* Contacts Table/List Here */}
                                <p>Contacts list coming soon.</p>
                            </CardContent>
                       </Card>
                    </TabsContent>

                    <TabsContent value="opportunities">
                        <Card>
                            <CardHeader><CardTitle>Opportunities with {customer.name}</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Opportunity</TableHead>
                                            <TableHead>Value</TableHead>
                                            <TableHead>Stage</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Close Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {opportunities.map(opp => (
                                            <TableRow key={opp.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/deals/${opp.id}`} className="text-primary hover:underline">{opp.name}</Link>
                                                </TableCell>
                                                <TableCell>₹{opp.value.toLocaleString('en-IN')}</TableCell>
                                                <TableCell><Badge variant="secondary">{opp.stage}</Badge></TableCell>
                                                <TableCell><Badge variant={getOpportunityStatusVariant(opp.status)}>{opp.status}</Badge></TableCell>
                                                <TableCell>{opp.closeDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="contracts">
                        <Card>
                            <CardHeader><CardTitle>Contracts with {customer.name}</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contract Title</TableHead>
                                            <TableHead>Value</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contracts.map(con => (
                                            <TableRow key={con.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={`/contracts/${con.id}`} className="text-primary hover:underline">{con.contractTitle}</Link>
                                                </TableCell>
                                                <TableCell>₹{con.value.toLocaleString('en-IN')}</TableCell>
                                                <TableCell><Badge variant={getContractStatusVariant(con.status)}>{con.status}</Badge></TableCell>
                                                <TableCell>{con.startDate}</TableCell>
                                                <TableCell>{con.endDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="invoices">
                        <Card>
                            <CardHeader><CardTitle>Invoices for {customer.name}</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Contract</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map(inv => (
                                            <TableRow key={inv.id}>
                                                <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                                                <TableCell>
                                                     <Link href={`/contracts/${inv.contractId}`} className="text-primary hover:underline">{inv.contractTitle}</Link>
                                                </TableCell>
                                                <TableCell>₹{inv.amount.toLocaleString('en-IN')}</TableCell>
                                                <TableCell><Badge variant={getInvoiceStatusVariant(inv.status)}>{inv.status}</Badge></TableCell>
                                                <TableCell>{inv.date}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
        
        <EditCustomerDialog 
            isOpen={isEditCustomerOpen}
            setIsOpen={setIsEditCustomerOpen}
            customer={customer}
            onCustomerUpdated={handleCustomerUpdated}
        />
        <EditProfilingDialog
            isOpen={isEditProfilingOpen}
            setIsOpen={setIsEditProfilingOpen}
            customer={customer}
            onCustomerUpdated={handleCustomerUpdated}
        />
        <AddContactDialog 
            isOpen={isAddContactOpen}
            setIsOpen={setIsAddContactOpen}
            onContactAdded={handleContactAdded}
            companyId={customer.id}
        />
    </>
  );
}
