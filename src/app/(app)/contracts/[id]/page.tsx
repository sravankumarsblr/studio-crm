
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, FileText, IndianRupee, Briefcase, PlusCircle, Milestone as MilestoneIcon, Upload, Package, FilePlus } from 'lucide-react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { contracts as initialContracts, companies, opportunities, products, users, Milestone, Quote, Contract, Invoice } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { AddMilestoneDialog } from '../add-milestone-dialog';
import { EditContractDialog } from '../edit-contract-dialog';
import { RaiseInvoiceDialog } from '../raise-invoice-dialog';
import { Input } from '@/components/ui/input';
import { MilestoneCard } from '../milestone-card';
import { EditMilestoneDialog } from '../edit-milestone-dialog';


const contractStatusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Active': 'default',
  'Renewed': 'default',
  'Draft': 'secondary',
  'Terminated': 'destructive',
  'Expired': 'outline',
};

export default function ContractDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params.id as string;
  
  const [contract, setContract] = useState(() => initialContracts.find((c) => c.id === contractId));
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isEditMilestoneOpen, setIsEditMilestoneOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRaiseInvoiceOpen, setIsRaiseInvoiceOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);


  // In a real app, this data would be fetched together. Here we simulate joins.
  const company = companies.find(c => c.name === contract?.companyName);
  const opportunity = opportunities.find(o => o.id === contract?.opportunityId);
  const acceptedQuote = opportunity?.quotes.find(q => q.status === 'Accepted');
  
  const handleMilestoneAdded = (newMilestone: Omit<Milestone, 'id' | 'invoices'>) => {
    if (contract) {
        const milestoneToAdd = { ...newMilestone, id: `m${Date.now()}`, invoices: []};
        setContract({ ...contract, milestones: [...contract.milestones, milestoneToAdd] });
    }
  };

  const handleMilestoneUpdated = (updatedMilestone: Milestone) => {
    if (contract) {
      const updatedMilestones = contract.milestones.map(m => m.id === updatedMilestone.id ? updatedMilestone : m);
      setContract({ ...contract, milestones: updatedMilestones });
    }
    setSelectedMilestone(null);
  };

  const handleContractUpdated = (updatedData: Partial<Contract>) => {
    if (contract) {
        setContract({ ...contract, ...updatedData });
    }
  };

  const handleInvoiceRaised = (milestoneId: string, newInvoice: Omit<Invoice, 'id' | 'raisedById'>) => {
    if (contract) {
        const updatedMilestones = contract.milestones.map(m => {
            if (m.id === milestoneId) {
                const newInvoiceWithId: Invoice = {
                    ...newInvoice,
                    id: `inv-${Date.now()}`,
                    raisedById: users.find(u => u.role === 'Admin')?.id || 'user1',
                }
                const updatedInvoices = [...m.invoices, newInvoiceWithId];
                const totalInvoiced = updatedInvoices.reduce((sum, inv) => sum + inv.amount, 0);
                
                let newInvoiceStatus: Milestone['invoiceStatus'] = 'Not Invoiced';
                if (totalInvoiced >= m.amount) {
                    newInvoiceStatus = 'Invoiced';
                } else if (totalInvoiced > 0) {
                    newInvoiceStatus = 'Partially Invoiced';
                }

                return { ...m, invoices: updatedInvoices, invoiceStatus: newInvoiceStatus };
            }
            return m;
        });
        setContract({ ...contract, milestones: updatedMilestones });
    }
  }

  const handleFileUpload = () => {
    if (!contractFile || !contract) return;
    setContract({ ...contract, documentName: contractFile.name });
    setContractFile(null); // Clear the file input
  };

  const openEditMilestoneDialog = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsEditMilestoneOpen(true);
  }
  
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
  
  const contractLineItemsWithDetails = contract.lineItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  });

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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Milestones &amp; Delivery</CardTitle>
                        <CardDescription>Key dates and payment status for this contract.</CardDescription>
                    </div>
                    <Button onClick={() => setIsAddMilestoneOpen(true)}><PlusCircle className="mr-2 h-4 w-4" /> Add Milestone</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {contract.milestones.map((milestone) => (
                      <MilestoneCard 
                        key={milestone.id} 
                        milestone={milestone} 
                        onEdit={() => openEditMilestoneDialog(milestone)}
                        onRaiseInvoice={() => openRaiseInvoiceDialog(milestone)}
                      />
                    ))}
                    {contract.milestones.length === 0 && (
                      <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                        No milestones added yet.
                      </div>
                    )}
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Contract Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Contract Value</p>
                            <p className="font-bold text-lg">₹{contract.value.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-muted-foreground">Status</p>
                            <Badge variant={contractStatusVariant[contract.status]} className="text-base">{contract.status}</Badge>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <p className="text-muted-foreground">Contract Period</p>
                            <p className="font-medium">{contract.startDate} to {contract.endDate}</p>
                        </div>
                         <div className="space-y-1 col-span-2">
                            <p className="text-muted-foreground">Linked Opportunity</p>
                            <Button variant="link" asChild className="p-0 h-auto text-left whitespace-normal leading-snug">
                              <a href={`/deals/${contract.opportunityId}`}>{opportunity.name}</a>
                            </Button>
                        </div>
                    </div>
                    <Separator/>
                    {acceptedQuote && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-muted-foreground">Source Documents</h4>
                            <div className="flex justify-between items-center"><span >PO Number</span><span className="font-medium">{acceptedQuote.poNumber}</span></div>
                            {acceptedQuote.poDocumentName && (<div className="flex justify-between items-center"><span>PO Document</span><Button variant="link" size="sm" className="p-0 h-auto">{acceptedQuote.poDocumentName}</Button></div>)}
                        </div>
                    )}
                    <Separator/>
                     <div className="space-y-2">
                        <h4 className="font-medium text-muted-foreground">Contract Agreement</h4>
                        {contract.documentName ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span className="font-medium">{contract.documentName}</span></div>
                            <Button variant="ghost" size="sm">Download</Button>
                        </div>
                        ) : (
                        <div className="flex items-center gap-2">
                            <Input id="contract-upload" type="file" accept=".pdf" className="text-xs flex-1" onChange={(e) => setContractFile(e.target.files ? e.target.files[0] : null)} />
                            <Button size="sm" onClick={handleFileUpload} disabled={!contractFile}><Upload className="mr-2 h-4 w-4" />Upload</Button>
                        </div>
                        )}
                    </div>
                    <Separator/>
                     <div className="flex items-start gap-3">
                        <MilestoneIcon className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Scope of Work</p>
                            <p className="font-medium whitespace-pre-wrap">{contract.scopeOfWork}</p>
                        </div>
                    </div>
                    <Separator/>
                    <div>
                      <h4 className="font-medium text-muted-foreground flex items-center gap-2 mb-2"><Package className="h-4 w-4"/>Products in Contract</h4>
                      <Table>
                          <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Qty</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                          <TableBody>
                              {contractLineItemsWithDetails.map((item) => {
                                  if (!item.product) return null;
                                  const total = item.product.price * item.quantity;
                                  return (<TableRow key={item.productId}><TableCell className="font-medium">{item.product.name}</TableCell><TableCell>{item.quantity}</TableCell><TableCell className="text-right">₹{total.toLocaleString('en-IN')}</TableCell></TableRow>);
                              })}
                          </TableBody>
                      </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
    <AddMilestoneDialog 
        isOpen={isAddMilestoneOpen} 
        setIsOpen={setIsAddMilestoneOpen} 
        contract={contract}
        onMilestoneAdded={handleMilestoneAdded}
    />
    {selectedMilestone && (
      <EditMilestoneDialog
        isOpen={isEditMilestoneOpen}
        setIsOpen={setIsEditMilestoneOpen}
        milestone={selectedMilestone}
        contract={contract}
        onMilestoneUpdated={handleMilestoneUpdated}
      />
    )}
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
            contract={contract}
            onInvoiceRaised={handleInvoiceRaised}
        />
    )}
    </>
  );
}
