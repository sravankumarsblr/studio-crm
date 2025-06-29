import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { companies } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CompaniesPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Companies" actionText="Add Company" onActionClick={() => {}} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-card rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Image src={company.logo} alt={company.name} width={40} height={40} className="rounded-md" data-ai-hint="logo" />
                  </TableCell>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.industry}</TableCell>
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
