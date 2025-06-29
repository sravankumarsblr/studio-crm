
'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, FileText, DollarSign, Building2, Calendar, CheckCircle, Clock, FilePlus, Milestone as MilestoneIcon, Briefcase, Hash, FileCheck2 } from 'lucide-react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { contracts, companies, opportunities, products } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

const contractStatusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Active': 'default',
  'Renewed': 'default',
  'Draft': 'secondary',
  'Terminated': 'destructive',
  'Expired': 'outline',
};

const milestoneStatusConfig = {
    'Completed': { variant: "default", icon: CheckCircle, label: "Completed" },
    'In Progress': { variant: "secondary", icon: Clock, label: "In Progress" },
    'Pending': { variant: "outline", icon: Clock, label: "Pending" },
} as const;

const invoiceStatusConfig = {
    'Paid': { variant: "default", label: "Paid" },
    'Invoiced': { variant: "secondary", label: "Invoiced" },
    'Not Invoiced': { variant: "outline", label: "Not Invoiced" },
} as const;

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params.id as string;
  
  const contract = contracts.find((c) => c.id === contractId);

  // In a real app, this data would be fetched together. Here we simulate joins.
  const company = companies.find(c => c.name === contract?.companyName);
  const opportunity = opportunities.find(o => o.id === contract?.opportunityId);
  const acceptedQuote = opportunity?.quotes.find(q => q.status === 'Accepted');

  if (!contract || !opportunity) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Contract or linked opportunity not found.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
       <Header title="">
        <div className="flex items-center gap-2 mr-auto">
            <Button variant="ghost" size="icon" onClick={() => router.push('/contracts')}>
                <ArrowLeft />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-foreground font-headline">{contract.contractTitle}</h1>
                <p className="text-sm text-muted-foreground">{contract.companyName}</p>
            </div>
        </div>
        <Button variant="outline"><FilePlus className="mr-2"/> Renew Contract</Button>
        <Button variant="outline"><Edit className="mr-2"/> Edit</Button>
        <Button variant="destructive">Terminate</Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Contract Value</CardTitle>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{contract.value.toLocaleString('en-IN')}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                    <FileText className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Badge variant={contractStatusVariant[contract.status]} className="text-base">{contract.status}</Badge>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Contract Type</CardTitle>
                    <FileText className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-semibold">{contract.type}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Linked Opportunity</CardTitle>
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <Button variant="link" asChild className="p-0 h-auto text-base">
                        <a href={`/deals/${contract.opportunityId}`}>{opportunity.name}</a>
                    </Button>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Milestones & Delivery</CardTitle>
                    <CardDescription>Key dates and payment status for this contract.</CardDescription>
                </CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Milestone</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Invoice</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contract.milestones.map((milestone) => {
                                const mStatus = milestoneStatusConfig[milestone.status];
                                const iStatus = invoiceStatusConfig[milestone.invoiceStatus];
                                return (
                                <TableRow key={milestone.id}>
                                    <TableCell className="font-medium">{milestone.name}</TableCell>
                                    <TableCell>{milestone.dueDate}</TableCell>
                                    <TableCell>
                                        <Badge variant={mStatus.variant as any} className="whitespace-nowrap">
                                            <mStatus.icon className="mr-1 h-3 w-3" />
                                            {mStatus.label}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                        <Badge variant={iStatus.variant as any}>{iStatus.label}</Badge>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Contract &amp; Order Details</CardTitle>
                    <CardDescription>Key terms and items from the original opportunity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 mt-1 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Effective Date</p>
                                <p className="font-medium">{contract.contractDate}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 mt-1 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Expiry Date</p>
                                <p className="font-medium">{contract.expiryDate}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MilestoneIcon className="w-5 h-5 mt-1 text-muted-foreground" />
                            <div>
                                <p className="text-muted-foreground">Scope of Work</p>
                                <p className="font-medium whitespace-pre-wrap">{contract.scopeOfWork}</p>
                            </div>
                        </div>
                    </div>
                     <Separator className="my-4"/>
                    {acceptedQuote && (
                        <div className="space-y-4 text-sm">
                             <div className="flex items-start gap-3">
                                <Hash className="w-4 h-4 mt-1 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">PO Number</p>
                                    <p className="font-medium">{acceptedQuote.poNumber}</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-3">
                                <FileCheck2 className="w-4 h-4 mt-1 text-muted-foreground" />
                                <div>
                                    <p className="text-muted-foreground">PO Document</p>
                                    <Button variant="link" className="p-0 h-auto font-medium">{acceptedQuote.poDocumentName || 'View PO'}</Button>
                                </div>
                            </div>
                        </div>
                    )}
                    <Separator className="my-4"/>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Qty</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {opportunity.lineItems.map((item) => {
                                const product = products.find(p => p.id === item.productId);
                                if (!product) return null;
                                const total = product.price * item.quantity;
                                return (
                                    <TableRow key={item.productId}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell className="text-right">₹{total.toLocaleString('en-IN')}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
