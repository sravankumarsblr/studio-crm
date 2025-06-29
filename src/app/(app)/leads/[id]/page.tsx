
"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Phone, Mail, Building2, DollarSign, List, Paperclip, StickyNote, PlusCircle, MoreVertical, Trash2, Download, UserCircle, Briefcase } from 'lucide-react';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AiLeadScorer } from '../ai-lead-scorer';
import { leads, contacts, companies, products } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogActivityDialog } from '../log-activity-dialog';
import { EditLeadDialog } from '../edit-lead-dialog';

const dummyActivity = [
    { type: 'note', content: 'Initial contact made, sent follow-up email with brochure.', user: 'Alex Green', time: '2 hours ago', icon: StickyNote },
    { type: 'email', content: 'Sent brochure and pricing information.', user: 'Alex Green', time: 'Yesterday', icon: Mail },
    { type: 'call', content: 'Called to qualify. Spoke with the primary contact, they are interested in Sensor Calibration.', user: 'Alex Green', time: '3 days ago', icon: Phone },
    { type: 'status', content: 'Status changed to Contacted.', user: 'System', time: '3 days ago', icon: List }
];

const dummyDocuments = [
    { id: 'doc1', name: 'Product_Brochure_Q3.pdf', size: '2.4 MB', uploadedAt: '2024-05-21' },
    { id: 'doc2', name: 'Initial_Quote_v1.docx', size: '780 KB', uploadedAt: '2024-05-22' },
];

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;
  const lead = leads.find((l) => l.id === leadId);
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // In a real app, this data would be fetched together. Here we simulate joins.
  const company = companies.find(c => c.name === lead?.companyName);
  const primaryContact = contacts.find(c => c.name === lead?.contactName);
  const associatedProducts = products.filter(p => p.associatedId === leadId);
  const associatedContacts = company ? contacts.filter(c => c.companyId === company.id) : [];

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'Qualified': return 'default';
      case 'New': return 'outline';
      case 'Contacted': return 'secondary';
      case 'Lost': return 'destructive';
      case 'Junk': return 'destructive';
      default: return 'outline';
    }
  };

  if (!lead) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Lead not found.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="">
        <div className="flex items-center gap-2 mr-auto">
            <Button variant="ghost" size="icon" onClick={() => router.push('/leads')}>
                <ArrowLeft />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-foreground font-headline">{lead.name}</h1>
                <p className="text-sm text-muted-foreground">{lead.companyName}</p>
            </div>
        </div>
        <Button variant="outline" onClick={() => setIsEditOpen(true)}><Edit className="mr-2"/> Edit</Button>
        <Button variant="outline" onClick={() => setIsLogActivityOpen(true)}>Log Activity</Button>
        <Button><Briefcase className="mr-2 h-4 w-4" /> Convert to Opportunity</Button>
      </Header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2 xl:col-span-3 space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Value</CardTitle>
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${lead.value.toLocaleString()}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                        <List className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Badge variant={getStatusVariant(lead.status) as any} className="text-base">{lead.status}</Badge>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">AI Conversion Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AiLeadScorer lead={lead} />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lead Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Company</p>
                            <p className="font-medium">{company?.name || lead.companyName}</p>
                            <p className="text-muted-foreground text-xs">{company?.industry}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <UserCircle className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Primary Contact</p>
                            <p className="font-medium">{primaryContact?.name || lead.contactName}</p>
                             <p className="text-muted-foreground text-xs">{primaryContact?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-muted-foreground">Interested Products</p>
                            {associatedProducts.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {associatedProducts.map(p => <Badge key={p.id} variant="secondary">{p.name}</Badge>)}
                                </div>
                            ) : <p className="font-medium">N/A</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

          </div>

          <div className="lg:col-span-1 xl:col-span-1">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
                <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
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

              <TabsContent value="documents" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Manage Documents</CardTitle>
                        <CardDescription>Upload and view documents for this lead.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label htmlFor="file-upload" className="sr-only">Choose file</label>
                            <Input id="file-upload" type="file" className="text-sm" />
                        </div>
                        <Separator />
                        <div className="space-y-3">
                           {dummyDocuments.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary/50">
                                <div className="flex items-center gap-3">
                                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{doc.name}</p>
                                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                                    </div>
                                </div>
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><Download className="mr-2 h-4 w-4"/>Download</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                           ))}
                        </div>
                    </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Add a Note</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea placeholder="Type your note here..." className="min-h-[120px]" />
                        <Button className="w-full">Save Note</Button>
                    </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <LogActivityDialog 
        isOpen={isLogActivityOpen} 
        setIsOpen={setIsLogActivityOpen} 
        lead={lead} 
        contacts={associatedContacts}
      />
      <EditLeadDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        lead={lead}
      />
    </div>
  );
}
