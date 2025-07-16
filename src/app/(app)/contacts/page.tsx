
"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contacts as initialContacts, companies, type Contact } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, ListFilter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AddContactDialog } from "./add-contact-dialog";
import { EditContactDialog } from "./edit-contact-dialog";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || 'N/A';
  }

  const handleStatusChange = (contactId: string, newStatus: boolean) => {
    setContacts(contacts.map(c => 
      c.id === contactId ? { ...c, status: newStatus ? 'active' : 'inactive' } : c
    ));
  };

  const handleContactAdded = (newContact: Omit<Contact, 'id' | 'status' | 'avatar'> & { companyId?: string }) => {
    const contactToAdd: Contact = {
        ...newContact,
        id: `con${new Date().getTime()}`,
        status: "active",
        avatar: "https://placehold.co/32x32.png",
        companyId: newContact.companyId || '',
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
  
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
        const fullName = `${contact.salutation} ${contact.firstName} ${contact.lastName}`;
        if (nameFilter && !fullName.toLowerCase().includes(nameFilter.toLowerCase())) return false;
        if (emailFilter && !contact.email.toLowerCase().includes(emailFilter.toLowerCase())) return false;
        if (companyFilter && contact.companyId !== companyFilter) return false;
        if (statusFilter && contact.status !== statusFilter) return false;
        return true;
    });
  }, [contacts, nameFilter, emailFilter, companyFilter, statusFilter]);

  const paginatedContacts = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredContacts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredContacts, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredContacts.length / rowsPerPage);

  const handleClearFilters = () => {
    setNameFilter('');
    setEmailFilter('');
    setCompanyFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <Header title="Contacts" actionText="Add Contact" onActionClick={() => setIsAddOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 w-full max-w-screen-2xl mx-auto">
          <Collapsible className="space-y-4">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" />
                Toggle Filters
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Filter Contacts</CardTitle>
                      <Button variant="ghost" size="sm" onClick={handleClearFilters}>Clear All</Button>
                  </div>
                  <CardDescription>Refine your contacts list by the criteria below.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input placeholder="Filter by name..." value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
                  <Input placeholder="Filter by email..." value={emailFilter} onChange={e => setEmailFilter(e.target.value)} />
                  <Select value={companyFilter} onValueChange={setCompanyFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by company..." /></SelectTrigger>
                    <SelectContent>
                      {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by status..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <Card>
            <div className="border-b">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Seniority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContacts.map((contact) => (
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
                      <TableCell>{contact.jobTitle}</TableCell>
                      <TableCell>{contact.seniority}</TableCell>
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
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="text-sm text-muted-foreground">
                  Showing {paginatedContacts.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                  {Math.min(currentPage * rowsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts.
              </div>
              <div className="flex items-center gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                  >
                      Previous
                  </Button>
                  <span className="text-sm">
                      Page {currentPage} of {totalPages > 0 ? totalPages : 1}
                  </span>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                  >
                      Next
                  </Button>
              </div>
            </div>
          </Card>
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

    