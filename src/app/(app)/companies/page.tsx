
"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { companies as initialCompanies, type Company } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { AddCompanyDialog } from "./add-company-dialog";
import { EditCompanyDialog } from "./edit-company-dialog";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleStatusChange = (companyId: string, newStatus: boolean) => {
    setCompanies(companies.map(c => 
      c.id === companyId ? { ...c, status: newStatus ? 'active' : 'inactive' } : c
    ));
  };

  const handleCompanyAdded = (newCompany: Company) => {
    setCompanies(prev => [...prev, newCompany]);
  };

  const handleCompanyUpdated = (updatedCompany: Company) => {
    setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
    setSelectedCompany(null);
  };
  
  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setIsEditOpen(true);
  };


  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Companies" actionText="Add Company" onActionClick={() => setIsAddOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-card rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>
                      <Link href={company.website} target="_blank" className="text-primary hover:underline">
                        {company.website.replace('https://', '')}
                      </Link>
                    </TableCell>
                    <TableCell>{company.numberOfEmployees}</TableCell>
                    <TableCell>
                       <Switch
                        id={`status-${company.id}`}
                        checked={company.status === 'active'}
                        onCheckedChange={(checked) => handleStatusChange(company.id, checked)}
                        aria-label="Company Status"
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
                          <DropdownMenuItem onClick={() => handleEditClick(company)}>
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
        </main>
      </div>
       <AddCompanyDialog 
        isOpen={isAddOpen} 
        setIsOpen={setIsAddOpen} 
        onCompanyCreated={handleCompanyAdded} 
      />
      {selectedCompany && (
        <EditCompanyDialog
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            company={selectedCompany}
            onCompanyUpdated={handleCompanyUpdated}
        />
      )}
    </>
  );
}
