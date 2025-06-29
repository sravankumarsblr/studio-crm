import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contacts, companies } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ContactsPage() {
  const getCompanyName = (companyId: string) => {
    return companies.find(c => c.id === companyId)?.name || 'N/A';
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Contacts" actionText="Add Contact" onActionClick={() => {}} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-card rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} data-ai-hint="person" />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{getCompanyName(contact.companyId)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
