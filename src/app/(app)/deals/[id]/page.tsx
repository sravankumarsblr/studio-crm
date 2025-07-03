
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, FileText, IndianRupee, Building2, UserCircle, Briefcase, FilePlus, StickyNote, Mail, Phone, PlusCircle, Trash2, CheckCircle } from 'lucide-react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { opportunities, contacts, companies, products, Quote, LineItem, Opportunity } from '@/lib/data';
import { QuoteCard } from '../quote-card';
import { GenerateQuoteDialog } from '../add-quote-dialog';
import { LogActivityDialog } from '../log-activity-dialog';
import { EditOpportunityDialog } from '../edit-deal-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductSelectorDialog } from '@/app/(app)/products/product-selector-dialog';
import { Input } from '@/components/ui/input';
import { AttachPoDialog } from '../attach-po-dialog';
import type { AttachPoFormValues } from '../attach-po-form';
import { AddContractDialog } from '@/app/(app)/contracts/add-contract-dialog';


const stageVariant: { [key in Opportunity['stage']]: "default" | "secondary" | "outline" } = {
  'Qualification': 'outline',
  'Proposal': 'secondary',
  'Negotiation': 'default',
};

const statusVariant: { [key in Opportunity['status']]: "default" | "secondary" | "destructive" | "outline" } = {
  'New': 'outline',
  'In Progress': 'secondary',
  'Won': 'default',
  'Lost': 'destructive',
};


const dummyActivity = [
    { type: 'note', content: 'Sent over the latest quote for negotiation.', user: 'Priya Singh', time: '4 hours ago', icon: StickyNote },
    { type: 'email', content: 'Followed up on quote QT-2024-002.', user: 'Priya Singh', time: '2 days ago', icon: Mail },
    { type: 'call', content: 'Discussed terms with primary contact, they are reviewing internally.', user: 'Priya Singh', time: '4 days ago', icon: Phone },
];

export default function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  
  const [opportunity, setOpportunity] = useState(() => opportunities.find((d) => d.id === opportunityId));
  const [isGenerateQuoteOpen, setIsGenerateQuoteOpen] = useState(false);
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [isEditOpportunityOpen, setIsEditOpportunityOpen] = useState(false);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [isAttachPoOpen, setIsAttachPoOpen] = useState(false);
  const [quoteToAttachPo, setQuoteToAttachPo] = useState<Quote | null>(null);
  const [isAddContractOpen, setIsAddContractOpen] = useState(false);


  // In a real app, this data would be fetched together. Here we simulate joins.
  const company = companies.find(c => c.name === opportunity?.companyName);
  const primaryContact = contacts.find(c => `${c.firstName} ${c.lastName}` === opportunity?.contactName);
  const associatedContacts = company ? contacts.filter(c => c.companyId === company.id) : [];

  const updateOpportunityLineItems = (newLineItems: LineItem[]) => {
    if (opportunity) {
        const newValue = newLineItems.reduce((acc, item) => {
            const product = products.find(p => p.id === item.productId);
            return acc + (product ? product.price * item.quantity : 0);
        }, 0);

        setOpportunity({
            ...opportunity,
            lineItems: newLineItems,
            value: newValue,
        });
    }
  }

  const handleQuantityChange = (productId: string, quantityStr: string) => {
    const quantity = parseInt(quantityStr, 10);
    if (opportunity && !isNaN(quantity)) {
        const newLineItems = opportunity.lineItems.map(item => 
            item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        updateOpportunityLineItems(newLineItems);
    }
  }

  const handleRemoveItem = (productId: string) => {
    if (opportunity) {
        const newLineItems = opportunity.lineItems.filter(item => item.productId !== productId);
        updateOpportunityLineItems(newLineItems);
    }
  }

  const handleProductsUpdated = (newProductIds: string[]) => {
    if (opportunity) {
        const existingQuantities = new Map(opportunity.lineItems.map(item => [item.productId, item.quantity]));
        const newLineItems = newProductIds.map(id => ({
            productId: id,
            quantity: existingQuantities.get(id) || 1,
        }));
        updateOpportunityLineItems(newLineItems);
    }
  };

  const handleQuoteAdded = (newQuote: Quote) => {
    if (opportunity) {
      const updatedOpportunity = {
        ...opportunity,
        quotes: [...opportunity.quotes, newQuote],
        status: newQuote.status === 'Accepted' ? 'Won' as const : opportunity.status,
      };
      setOpportunity(updatedOpportunity);
    }
  };

  const handleQuoteDeleted = (quoteId: string) => {
     if (opportunity) {
      const updatedQuotes = opportunity.quotes.filter(q => q.id !== quoteId);
      const updatedOpportunity = {
        ...opportunity,
        quotes: updatedQuotes,
      };
      setOpportunity(updatedOpportunity);
    }
  }

  const handleOpenAttachPoDialog = (quote: Quote) => {
    setQuoteToAttachPo(quote);
    setIsAttachPoOpen(true);
  };

  const handlePoAttached = (quoteId: string, poDetails: AttachPoFormValues) => {
    if (opportunity) {
      const updatedQuotes = opportunity.quotes.map(q => {
        if (q.id === quoteId) {
          return {
            ...q,
            status: 'Accepted' as const,
            poNumber: poDetails.poNumber,
            poValue: poDetails.poValue,
            poDate: poDetails.poDate,
            poDocumentName: poDetails.poDocument?.name,
          };
        }
        return q;
      });

      const updatedOpportunity = {
        ...opportunity,
        quotes: updatedQuotes,
        status: 'Won' as const,
      };
      setOpportunity(updatedOpportunity);
      setQuoteToAttachPo(null);
    }
  };

  if (!opportunity) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Opportunity not found.</p>
        </div>
    );
  }
  
  const isWon = opportunity.status === 'Won';

  return (
    <div className="flex flex-col h-full">
      <Header title="">
        <div className="flex items-center gap-2 mr-auto">
            <Button variant="ghost" size="icon" onClick={() => router.push('/deals')}>
                <ArrowLeft />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-foreground font-headline">{opportunity.name}</h1>
                <p className="text-sm text-muted-foreground">{opportunity.companyName}</p>
            </div>
        </div>
        <Button variant="outline" onClick={() => setIsLogActivityOpen(true)}>Log Activity</Button>
        <Button variant="outline" onClick={() => setIsEditOpportunityOpen(true)}><Edit className="mr-2"/> Edit</Button>
        <Button onClick={() => setIsAddContractOpen(true)} disabled={!isWon}>
          <FilePlus className="mr-2 h-4 w-4" /> Convert to Contract
        </Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                        <IndianRupee className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{opportunity.value.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Stage</CardTitle>
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Badge variant={stageVariant[opportunity.stage]} className="text-base">{opportunity.stage}</Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Badge variant={statusVariant[opportunity.status]} className="text-base">{opportunity.status}</Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Expected Close</CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">{opportunity.closeDate}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Opportunity Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Company</p>
                            <p className="font-medium">{company?.name || opportunity.companyName}</p>
                            <p className="text-muted-foreground text-xs">{company?.industry}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <UserCircle className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Primary Contact</p>
                            <p className="font-medium">{primaryContact?.firstName} {primaryContact?.lastName}</p>
                             <p className="text-muted-foreground text-xs">{primaryContact?.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Products & Services</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsProductSelectorOpen(true)} disabled={isWon}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add/Edit Products
                </Button>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="w-[100px]">Quantity</TableHead>
                            <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                            <TableHead className="w-[120px] text-right">Total</TableHead>
                            {!isWon && <TableHead className="w-[50px]"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {opportunity.lineItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">
                                    No products added yet.
                                </TableCell>
                            </TableRow>
                        )}
                        {opportunity.lineItems.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            if (!product) return null;
                            const total = product.price * item.quantity;
                            return (
                                <TableRow key={item.productId}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                                            className="h-8 w-20"
                                            disabled={isWon}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">₹{product.price.toLocaleString('en-IN')}</TableCell>
                                    <TableCell className="text-right">₹{total.toLocaleString('en-IN')}</TableCell>
                                    {!isWon && (
                                        <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId)}>
                                            <Trash2 className="h-4 w-4 text-destructive"/>
                                        </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                 </Table>
              </CardContent>
            </Card>

          </div>

          <div className="lg:col-span-1 xl:col-span-1">
            <Tabs defaultValue="quotes" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-4">
                 <div className="space-y-6">
                    {dummyActivity.map((item, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary">
                                <item.icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm">{item.content}</p>
                                <p className="text-xs text-muted-foreground">{item.user} &middot; {item.time}</p>
                            </div>
                        </div>
                    ))}
                 </div>
              </TabsContent>

              <TabsContent value="quotes" className="mt-4 space-y-4">
                <Button className="w-full" onClick={() => setIsGenerateQuoteOpen(true)} disabled={isWon}>
                    <FilePlus className="mr-2"/> Generate Quote
                </Button>
                <div className="space-y-4">
                  {opportunity.quotes.length > 0 ? (
                    opportunity.quotes.map(quote => (
                      <QuoteCard 
                        key={quote.id} 
                        quote={quote} 
                        opportunityStatus={opportunity.status}
                        onDelete={handleQuoteDeleted}
                        onAttachPo={handleOpenAttachPoDialog}
                      />
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                        <p>No quotes have been generated for this opportunity yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                 <p className="text-sm text-muted-foreground p-4 text-center">Notes functionality coming soon.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <GenerateQuoteDialog
        isOpen={isGenerateQuoteOpen}
        setIsOpen={setIsGenerateQuoteOpen}
        opportunity={opportunity}
        onQuoteAdded={handleQuoteAdded}
      />
      <LogActivityDialog
        isOpen={isLogActivityOpen}
        setIsOpen={setIsLogActivityOpen}
        opportunity={opportunity}
        contacts={associatedContacts}
      />
      <EditOpportunityDialog
        isOpen={isEditOpportunityOpen}
        setIsOpen={setIsEditOpportunityOpen}
        opportunity={opportunity}
      />
       <ProductSelectorDialog
        isOpen={isProductSelectorOpen}
        setIsOpen={setIsProductSelectorOpen}
        onProductsAdded={handleProductsUpdated}
        initialSelectedIds={opportunity.lineItems.map(item => item.productId)}
      />
      {quoteToAttachPo && (
        <AttachPoDialog
          isOpen={isAttachPoOpen}
          setIsOpen={setIsAttachPoOpen}
          quote={quoteToAttachPo}
          onPoAttached={handlePoAttached}
        />
      )}
       {isWon && (
        <AddContractDialog
            isOpen={isAddContractOpen}
            setIsOpen={setIsAddContractOpen}
            opportunity={opportunity}
        />
       )}
    </div>
  );
}
