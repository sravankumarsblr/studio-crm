
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contracts as initialContracts, type Contract } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SelectOpportunityDialog } from "./select-opportunity-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IndianRupee, FileWarning, CalendarClock, AlertTriangle, ListFilter } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { isBefore, isAfter, addDays, parse } from 'date-fns';

export default function ContractsPage() {
  const [isSelectOppOpen, setIsSelectOppOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  
  // Filter states
  const [titleFilter, setTitleFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const parseDate = (dateString: string) => parse(dateString, 'yyyy-MM-dd', new Date());

  const summaryData = useMemo(() => {
    const activeContracts = contracts.filter(c => c.status === 'Active');
    const today = new Date();
    const expiryThreshold = addDays(today, 60);

    const totalActiveValue = activeContracts.reduce((sum, c) => sum + c.value, 0);

    const nearingExpiryCount = activeContracts.filter(c => {
        const endDate = parseDate(c.endDate);
        return isAfter(endDate, today) && isBefore(endDate, expiryThreshold);
    }).length;

    const pendingInvoiceValue = contracts
      .flatMap(c => c.milestones)
      .filter(m => m.status === 'Completed' && m.invoiceStatus === 'Not Invoiced')
      .reduce((sum, m) => sum + m.amount, 0);

    const overdueMilestonesCount = contracts
      .flatMap(c => c.milestones)
      .filter(m => m.status !== 'Completed' && isBefore(parseDate(m.dueDate), today))
      .length;

    return {
      totalActiveValue,
      nearingExpiryCount,
      pendingInvoiceValue,
      overdueMilestonesCount,
    };
  }, [contracts]);

  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
        if (titleFilter && !contract.contractTitle.toLowerCase().includes(titleFilter.toLowerCase())) return false;
        if (companyFilter && !contract.companyName.toLowerCase().includes(companyFilter.toLowerCase())) return false;
        if (statusFilter && contract.status !== statusFilter) return false;
        if (typeFilter && contract.type !== typeFilter) return false;
        return true;
    });
  }, [contracts, titleFilter, companyFilter, statusFilter, typeFilter]);

  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredContracts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredContracts, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredContracts.length / rowsPerPage);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Renewed': return 'default';
      case 'Draft': return 'secondary';
      case 'Terminated': return 'destructive';
      case 'Expired': return 'outline';
      default: return 'outline';
    }
  };

  const handleClearFilters = () => {
    setTitleFilter('');
    setCompanyFilter('');
    setStatusFilter('');
    setTypeFilter('');
    setCurrentPage(1);
  };

  const handleContractAdded = (newContract: Contract) => {
    setContracts(prev => [...prev, newContract]);
  }

  const contractStatuses = [...new Set(contracts.map(c => c.status))];
  const contractTypes = [...new Set(contracts.map(c => c.type))];

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <Header title="Contracts" actionText="Add Contract" onActionClick={() => setIsSelectOppOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 w-full max-w-screen-2xl mx-auto">
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Active Value</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{summaryData.totalActiveValue.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground">Value of all active contracts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                <FileWarning className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{summaryData.pendingInvoiceValue.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground">Value of uninvoiced completed milestones</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nearing Expiry</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.nearingExpiryCount}</div>
                <p className="text-xs text-muted-foreground">Contracts expiring in the next 60 days</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At-Risk Milestones</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.overdueMilestonesCount}</div>
                <p className="text-xs text-muted-foreground">Milestones that are past their due date</p>
              </CardContent>
            </Card>
          </div>

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
                    <CardTitle className="text-base">Filter Contracts</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>Clear All</Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input placeholder="Filter by title..." value={titleFilter} onChange={e => setTitleFilter(e.target.value)} />
                  <Input placeholder="Filter by company..." value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by status..." /></SelectTrigger>
                    <SelectContent>
                      {contractStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by type..." /></SelectTrigger>
                    <SelectContent>
                      {contractTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
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
                    <TableHead>Contract Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedContracts.map((contract) => (
                    <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                        <Link href={`/contracts/${contract.id}`} className="hover:underline text-primary">
                            {contract.contractTitle}
                        </Link>
                        </TableCell>
                        <TableCell>{contract.companyName}</TableCell>
                        <TableCell>₹{contract.value.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{contract.startDate}</TableCell>
                        <TableCell>{contract.endDate}</TableCell>
                        <TableCell>
                        <Badge variant={getStatusVariant(contract.status) as any}>{contract.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/contracts/${contract.id}`}>View Details</Link>
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="text-sm text-muted-foreground">
                  Showing {paginatedContracts.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                  {Math.min(currentPage * rowsPerPage, filteredContracts.length)} of {filteredContracts.length} contracts.
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
      <SelectOpportunityDialog isOpen={isSelectOppOpen} setIsOpen={setIsSelectOppOpen} onContractAdded={handleContractAdded} />
    </>
  );
}
