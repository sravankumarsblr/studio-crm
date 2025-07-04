
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, FileText, IndianRupee, Building2, Calendar, CheckCircle, Clock, FilePlus, Milestone as MilestoneIcon, Briefcase, Hash, FileCheck2, User, MoreHorizontal, PlusCircle, Upload } from 'lucide-react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { contracts as initialContracts, companies, opportunities, products, users, Milestone, Quote, Contract } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { AddMilestoneDialog } from '../add-milestone-dialog';
import { EditContractDialog } from '../edit-contract-dialog';
import { RaiseInvoiceDialog } from '../raise-invoice-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const contractStatusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Active': 'default',
  'Renewed': 'default',
  'Draft': 'secondary',
  'Terminated': 'destructive',
  'Expired': 'outline',
};

const milestoneStatusConfig = {
    'Completed': { variant: "default", icon: CheckCircle, label: "Completed", progress: 100 },
    'In Progress': { variant: "secondary", icon: Clock, label: "In Progress", progress: 50 },
    'Pending': { variant: "outline", icon: Clock, label: "Pending", progress: 0 },
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
  
  const [contract, setContract] = useState(() => initialContracts.find((c) => c.id === contractId));
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRaiseInvoiceOpen, setIsRaiseInvoiceOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);


  // In a real app, this data would be fetched together. Here we simulate joins.
  const company = companies.find(c => c.name === contract?.companyName);
  const opportunity = opportunities.find(o => o.id === contract?.opportunityId);
  const acceptedQuote = opportunity?.quotes.find(q => q.status === 'Accepted');
  
  const handleMilestoneAdded = (newMilestone: Omit<Milestone, 'id'>) => {
    if (contract) {
        const milestoneToAdd = { ...newMilestone, id: `m${Date.now()}`};
        setContract({ ...contract, milestones: [...contract.milestones, milestoneToAdd] });
    }
  };

  const handleContractUpdated = (updatedData: Partial<Contract>) => {
    if (contract) {
        setContract({ ...contract, ...updatedData });
    }
  };

  const handleInvoiceRaised = (milestoneId: string, invoiceNumber: string) => {
    if (contract) {
        const updatedMilestones = contract.milestones.map(m => {
            if (m.id === milestoneId) {
                return {
                    ...m,
                    invoiceStatus: 'Invoiced' as const,
                    invoiceNumber: invoiceNumber,
                    invoiceRaisedById: users.find(u => u.role === 'Admin')?.id // Placeholder
                }
            }
            return m;
        });
        setContract({ ...contract, milestones: updatedMilestones });
    }
  }

  const handleFileUpload = () => {
    if (!contractFile || !contract) return;
    // In a real app, this would be an API call.
    // Here, we'll just simulate the upload by updating the state.
    setContract({ ...contract, documentName: contractFile.name });
    setContractFile(null); // Clear the file input
  };
  
  const openRaiseInvoiceDialog = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsRaiseInvoiceOpen(true);
  }

  if (!contract || !opportunity) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Contract or linked opportunity not found.</p>
        </div>
    );
  }
  
  const getAssigneeName = (userId: string) => users.find(u => u.id === userId)?.name || 'N/A';

  return (
    <>
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
        <Button variant="outline" onClick={() => setIsEditOpen(true)}><Edit className="mr-2"/> Edit</Button>
        <Button variant="destructive">Terminate</Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Contract Value</CardTitle>
                    <IndianRupee className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹{contract.value.toLocaleString('en-IN')}</div>
                    <p className="text-xs text-muted-foreground">PO Number: {contract.poNumber}</p>
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
                    <CardTitle className="text-sm font-medium">Contract Period</CardTitle>
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-semibold">{contract.startDate} to {contract.endDate}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Linked Opportunity</CardTitle>
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <Button variant="link" asChild className="p-0 h-auto text-base text-left whitespace-normal leading-snug">
                        <a href={`/deals/${contract.opportunityId}`}>{opportunity.name}</a>
                    </Button>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Milestones &amp; Delivery</CardTitle>
                        <CardDescription>Key dates and payment status for this contract.</CardDescription>
                    </div>
                    <Button onClick={() => setIsAddMilestoneOpen(true)}><PlusCircle className="mr-2 h-4 w-4" /> Add Milestone</Button>
                </CardHeader>
                 <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Milestone</TableHead>
                                <TableHead>Assigned To</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Invoice Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contract.milestones.map((milestone) => {
                                const mStatus = milestoneStatusConfig[milestone.status];
                                const iStatus = invoiceStatusConfig[milestone.invoiceStatus];
                                return (
                                <TableRow key={milestone.id}>
                                    <TableCell className="font-medium">{milestone.name}</TableCell>
                                    <TableCell>{getAssigneeName(milestone.assignedToId)}</TableCell>
                                    <TableCell>{milestone.dueDate}</TableCell>
                                    <TableCell>₹{milestone.amount.toLocaleString('en-IN')}</TableCell>
                                    <TableCell><Progress value={mStatus.progress} className="h-2" /></TableCell>
                                     <TableCell>
                                        <Badge variant={iStatus.variant as any}>{iStatus.label}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openRaiseInvoiceDialog(milestone)} disabled={milestone.invoiceStatus !== 'Not Invoiced'}>
                                                    Raise Invoice
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Contract Documents &amp; Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    {acceptedQuote && (
                        <div>
                        <h4 className="font-medium mb-2 text-muted-foreground">Source Documents</h4>
                        <div className="space-y-3 p-3 rounded-md border bg-muted/50">
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Source Quote</span>
                                <Button variant="link" size="sm" className="p-0 h-auto">{acceptedQuote.quoteNumber}</Button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">PO Number</span>
                                <span className="font-medium">{acceptedQuote.poNumber}</span>
                            </div>
                            {acceptedQuote.poDocumentName && (
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">PO Document</span>
                                    <Button variant="link" size="sm" className="p-0 h-auto">{acceptedQuote.poDocumentName}</Button>
                                </div>
                            )}
                        </div>
                        </div>
                    )}
                    <Separator/>
                     <div>
                        <h4 className="font-medium mb-2 text-muted-foreground">Contract Agreement</h4>
                        <div className="space-y-2 p-3 rounded-md border bg-muted/50">
                            {contract.documentName ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="font-medium">{contract.documentName}</span>
                                </div>
                                <Button variant="ghost" size="sm">Download</Button>
                            </div>
                            ) : (
                            <div className="flex items-center gap-2">
                                <Input 
                                    id="contract-upload" 
                                    type="file" 
                                    accept=".pdf" 
                                    className="text-xs flex-1"
                                    onChange={(e) => setContractFile(e.target.files ? e.target.files[0] : null)}
                                />
                                <Button size="sm" onClick={handleFileUpload} disabled={!contractFile}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                </Button>
                            </div>
                            )}
                        </div>
                    </div>
                    <Separator/>
                     <div className="flex items-start gap-3">
                        <MilestoneIcon className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Scope of Work</p>
                            <p className="font-medium whitespace-pre-wrap">{contract.scopeOfWork}</p>
                        </div>
                    </div>
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
                            {contract.lineItems.map((item) => {
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
    <AddMilestoneDialog 
        isOpen={isAddMilestoneOpen} 
        setIsOpen={setIsAddMilestoneOpen} 
        contractId={contract.id}
        contractValue={contract.value}
        existingMilestoneTotal={contract.milestones.reduce((acc, m) => acc + m.amount, 0)}
        onMilestoneAdded={handleMilestoneAdded}
    />
    {contract && (
        <EditContractDialog
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            contract={contract}
            onContractUpdated={handleContractUpdated}
        />
    )}
    {selectedMilestone && (
        <RaiseInvoiceDialog
            isOpen={isRaiseInvoiceOpen}
            setIsOpen={setIsRaiseInvoiceOpen}
            milestone={selectedMilestone}
            onInvoiceRaised={handleInvoiceRaised}
        />
    )}
    </>
  );
}
