
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contacts as initialContacts, companies, type Contact } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { AddContactDialog } from "./add-contact-dialog";
import { EditContactDialog } from "./edit-contact-dialog";
import type { AddContactFormValues } from "./add-contact-form";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || 'N/A';
  }

  const handleStatusChange = (contactId: string, newStatus: boolean) => {
    setContacts(contacts.map(c => 
      c.id === contactId ? { ...c, status: newStatus ? 'active' : 'inactive' } : c
    ));
  };

  const handleContactAdded = (newContact: AddContactFormValues) => {
    const contactToAdd: Contact = {
        ...newContact,
        id: `con${new Date().getTime()}`,
        status: 'active',
        avatar: 'https://placehold.co/32x32.png',
    };
    setContacts(prev => [...prev, contactToAdd]);
  };

  const handleContactUpdated = (updatedContact: Contact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    setSelectedContact(null);
  };
  
  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditOpen(true);
  };

  const handleDelete = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Contacts" actionText="Add Contact" onActionClick={() => setIsAddOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-card rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={`${contact.firstName} ${contact.lastName}`} data-ai-hint="person" />
                        <AvatarFallback>{contact.firstName.charAt(0)}{contact.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{contact.salutation} {contact.firstName} {contact.lastName}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{getCompanyName(contact.companyId)}</TableCell>
                    <TableCell>{contact.designation}</TableCell>
                    <TableCell>
                       <Switch
                        id={`status-${contact.id}`}
                        checked={contact.status === 'active'}
                        onCheckedChange={(checked) => handleStatusChange(contact.id, checked)}
                        aria-label="Contact Status"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(contact)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(contact.id)} className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
       <AddContactDialog 
        isOpen={isAddOpen} 
        setIsOpen={setIsAddOpen} 
        onContactAdded={handleContactAdded} 
      />
      {selectedContact && (
        <EditContactDialog
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            contact={selectedContact}
            onContactUpdated={handleContactUpdated}
        />
      )}
    </>
  );
}
