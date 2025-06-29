
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, StickyNote } from 'lucide-react';
import type { Lead, Contact } from '@/lib/data';

type LogActivityDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  lead: Lead;
  contacts: Contact[];
};

export function LogActivityDialog({ isOpen, setIsOpen, lead, contacts }: LogActivityDialogProps) {
  const [activeTab, setActiveTab] = useState("call");
  
  const handleSave = () => {
    // In a real app, this would save the activity and re-fetch the timeline
    console.log("Activity saved for lead:", lead.name);
    // Here you would also handle email sending logic if the active tab is 'email'
    setIsOpen(false);
  };

  const primaryContactEmail = contacts.find(c => c.name === lead.contactName)?.email || '';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Log Activity for "{lead.name}"</DialogTitle>
          <DialogDescription>
            Record a call, send an email, or add a note. Your activity history will be updated.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="call"><Phone className="mr-2"/> Log Call</TabsTrigger>
            <TabsTrigger value="email"><Mail className="mr-2"/> Send Email</TabsTrigger>
            <TabsTrigger value="note"><StickyNote className="mr-2"/> Add Note</TabsTrigger>
          </TabsList>
          
          <TabsContent value="call" className="pt-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="call-summary">Call Summary</Label>
                <Textarea id="call-summary" placeholder="Enter details of the call..." className="min-h-[150px]" />
            </div>
             <p className="text-sm text-muted-foreground">
                The call will be logged with the primary contact: {lead.contactName}.
            </p>
          </TabsContent>
          
          <TabsContent value="email" className="pt-4 space-y-4">
             <div className="space-y-2">
                <Label htmlFor="email-to">To</Label>
                <Input id="email-to" readOnly defaultValue={primaryContactEmail} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input id="email-subject" placeholder="Enter email subject" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email-body">Body</Label>
                <Textarea id="email-body" placeholder="Compose your email..." className="min-h-[200px]" />
            </div>
          </TabsContent>
          
          <TabsContent value="note" className="pt-4 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="note-content">Note</Label>
                <Textarea id="note-content" placeholder="Type your note here..." className="min-h-[150px]" />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            {activeTab === 'email' ? 'Send Email' : 'Save Activity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
