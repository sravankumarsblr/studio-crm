
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, FileText, DollarSign, Building2, UserCircle, Briefcase, FilePlus, StickyNote, Mail, Phone } from 'lucide-react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { opportunities, contacts, companies, products, Quote } from '@/lib/data';
import { QuoteCard } from '../quote-card';
import { AddQuoteDialog } from '../add-quote-dialog';
import { LogActivityDialog } from '../log-activity-dialog';
import { EditOpportunityDialog } from '../edit-deal-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const stageVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Qualification': 'outline',
  'Proposal': 'secondary',
  'Negotiation': 'default',
  'Closed Won': 'default',
  'Closed Lost': 'destructive',
};

const dummyActivity = [
    { type: 'note', content: 'Sent over the latest quote for negotiation.', user: 'Alex Green', time: '4 hours ago', icon: StickyNote },
    { type: 'email', content: 'Followed up on quote QT-2024-002.', user: 'Alex Green', time: '2 days ago', icon: Mail },
    { type: 'call', content: 'Discussed terms with primary contact, they are reviewing internally.', user: 'Alex Green', time: '4 days ago', icon: Phone },
];

export default function OpportunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  
  const [opportunity, setOpportunity] = useState(() => opportunities.find((d) => d.id === opportunityId));
  const [isAddQuoteOpen, setIsAddQuoteOpen] = useState(false);
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [isEditOpportunityOpen, setIsEditOpportunityOpen] = useState(false);

  // In a real app, this data would be fetched together. Here we simulate joins.
  const company = companies.find(c => c.name === opportunity?.companyName);
  const primaryContact = contacts.find(c => c.name === opportunity?.contactName);
  const associatedContacts = company ? contacts.filter(c => c.companyId === company.id) : [];

  const handleQuoteAdded = (newQuote: Quote) => {
    if (opportunity) {
      const updatedOpportunity = {
        ...opportunity,
        quotes: [...opportunity.quotes, newQuote],
        value: opportunity.quotes.reduce((acc, q) => acc + q.value, 0) + newQuote.value
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
        value: updatedQuotes.reduce((acc, q) => acc + q.value, 0)
      };
      setOpportunity(updatedOpportunity);
    }
  }

  if (!opportunity) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Opportunity not found.</p>
        </div>
    );
  }

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
        <Button>Convert to Contract</Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{opportunity.value.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Stage</CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Badge variant={stageVariant[opportunity.stage]} className="text-base">{opportunity.stage}</Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Expected Close</CardTitle>
                        <FileText className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{opportunity.closeDate}</div>
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
                            <p className="font-medium">{primaryContact?.name || opportunity.contactName}</p>
                             <p className="text-muted-foreground text-xs">{primaryContact?.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products & Services</CardTitle>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="w-[100px]">Quantity</TableHead>
                            <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                            <TableHead className="w-[120px] text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {opportunity.lineItems.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            if (!product) return null;
                            const total = product.price * item.quantity;
                            return (
                                <TableRow key={item.productId}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">₹{product.price.toLocaleString('en-IN')}</TableCell>
                                    <TableCell className="text-right">₹{total.toLocaleString('en-IN')}</TableCell>
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
                <Button className="w-full" onClick={() => setIsAddQuoteOpen(true)}>
                    <FilePlus className="mr-2"/> Add Quote
                </Button>
                <div className="space-y-4">
                  {opportunity.quotes.length > 0 ? (
                    opportunity.quotes.map(quote => (
                      <QuoteCard key={quote.id} quote={quote} onDelete={handleQuoteDeleted} />
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                        <p>No quotes have been added to this opportunity yet.</p>
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
      <AddQuoteDialog
        isOpen={isAddQuoteOpen}
        setIsOpen={setIsAddQuoteOpen}
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
    </div>
  );
}
