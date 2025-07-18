
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contracts as initialContracts, type Contract, type Invoice, type Milestone } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ListFilter, Download, Send } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { SelectMilestoneDialog } from "./select-milestone-dialog";
import { users } from "@/lib/data";

type InvoiceListItem = Invoice & {
  contractId: string;
  contractTitle: string;
  companyName: string;
  milestoneName: string;
};

export default function InvoicesPage() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [isSelectMilestoneOpen, setIsSelectMilestoneOpen] = useState(false);
  
  const allInvoices = useMemo((): InvoiceListItem[] => {
    return contracts.flatMap(contract => 
      contract.milestones.flatMap(milestone => 
        milestone.invoices.map(invoice => ({
          ...invoice,
          contractId: contract.id,
          contractTitle: contract.contractTitle,
          companyName: contract.companyName,
          milestoneName: milestone.name,
        }))
      )
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contracts]);
  
  // Filter states
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const filteredInvoices = useMemo(() => {
    return allInvoices.filter(invoice => {
        if (companyFilter && !invoice.companyName.toLowerCase().includes(companyFilter.toLowerCase())) return false;
        if (statusFilter && invoice.status !== statusFilter) return false;
        return true;
    });
  }, [allInvoices, companyFilter, statusFilter]);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredInvoices, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Invoiced': return 'secondary';
      case 'Overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const handleClearFilters = () => {
    setCompanyFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };
  
  const handleInvoiceRaised = (contractId: string, milestoneId: string, newInvoice: Omit<Invoice, 'id' | 'raisedById'>) => {
    setContracts(prevContracts => {
        return prevContracts.map(contract => {
            if (contract.id === contractId) {
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
                return { ...contract, milestones: updatedMilestones };
            }
            return contract;
        });
    });
  }


  const invoiceStatuses = [...new Set(allInvoices.map(i => i.status))];

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <Header title="Invoices" actionText="Add Invoice" onActionClick={() => setIsSelectMilestoneOpen(true)} />
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
                    <div className="text-base font-semibold">Filter Invoices</div>
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>Clear All</Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input placeholder="Filter by company..." value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by status..." /></SelectTrigger>
                    <SelectContent>
                      {invoiceStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.companyName}</TableCell>
                        <TableCell>
                            <Link href={`/contracts/${invoice.contractId}`} className="hover:underline text-primary">
                                {invoice.contractTitle}
                            </Link>
                        </TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>₹{invoice.amount.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                           <Badge variant={getStatusVariant(invoice.status) as any}>{invoice.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Download Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" /> Send to Tally (soon)
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
                  Showing {paginatedInvoices.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                  {Math.min(currentPage * rowsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices.
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
       <SelectMilestoneDialog
        isOpen={isSelectMilestoneOpen}
        setIsOpen={setIsSelectMilestoneOpen}
        onInvoiceRaised={handleInvoiceRaised}
      />
    </>
  );
}
