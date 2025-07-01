
"use client";

import React, { useState, useMemo } from "react";
import Link from 'next/link';
import { MoreHorizontal, ListFilter, Users, Phone, CheckCircle, XCircle, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { leads as allLeads, users, type Lead } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { AiLeadScorer } from "./ai-lead-scorer";
import { AddLeadDialog } from "./add-lead-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost', 'Junk'] as const;

const statusIcons: { [key in typeof LEAD_STATUSES[number]]: React.ElementType } = {
  New: Users,
  Contacted: Phone,
  Qualified: CheckCircle,
  Lost: XCircle,
  Junk: Trash2,
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(allLeads);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const { toast } = useToast();

  const [leadNameFilter, setLeadNameFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [valueFilter, setValueFilter] = useState({ min: "", max: "" });
  const [ownerFilter, setOwnerFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const leadStatusCounts = useMemo(() => {
    const counts: Record<typeof LEAD_STATUSES[number], number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Lost: 0,
      Junk: 0,
    };
    for (const lead of allLeads) { // counts based on all leads, not filtered
      if (counts[lead.status] !== undefined) {
        counts[lead.status]++;
      }
    }
    return counts;
  }, [allLeads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (leadNameFilter && !lead.name.toLowerCase().includes(leadNameFilter.toLowerCase())) return false;
      if (companyFilter && !lead.companyName.toLowerCase().includes(companyFilter.toLowerCase())) return false;
      if (statusFilter && lead.status !== statusFilter) return false;
      if (valueFilter.min && lead.value < Number(valueFilter.min)) return false;
      if (valueFilter.max && lead.value > Number(valueFilter.max)) return false;
      if (ownerFilter && lead.ownerId !== ownerFilter) return false;
      if (dateFilter?.from && new Date(lead.createdDate) < dateFilter.from) return false;
      if (dateFilter?.to && new Date(lead.createdDate) > new Date(dateFilter.to).setHours(23, 59, 59, 999)) return false;
      return true;
    });
  }, [leads, leadNameFilter, companyFilter, statusFilter, valueFilter, ownerFilter, dateFilter]);

  const paginatedLeads = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredLeads.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLeads, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredLeads.length / rowsPerPage);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Qualified': return 'default';
      case 'New': return 'outline';
      case 'Contacted': return 'secondary';
      case 'Lost': return 'destructive';
      case 'Junk': return 'destructive';
      default: return 'outline';
    }
  };
  
  const handleConvertToOpportunity = (leadName: string) => {
    toast({
      title: "Lead Converted",
      description: `A new opportunity has been created for "${leadName}".`,
    });
  };

  const handleClearFilters = () => {
    setLeadNameFilter('');
    setCompanyFilter('');
    setStatusFilter('');
    setValueFilter({ min: "", max: "" });
    setOwnerFilter('');
    setDateFilter(undefined);
    setCurrentPage(1);
  };
  
  return (
    <div className="flex flex-col h-full">
      <Header title="Leads" actionText="Add Lead" onActionClick={() => setIsAddLeadOpen(true)} />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {LEAD_STATUSES.map(status => {
            const Icon = statusIcons[status];
            return (
              <Card key={status}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
                  <CardTitle className="text-sm font-medium">{status}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-2 pt-0">
                  <div className="text-2xl font-bold">{leadStatusCounts[status]}</div>
                </CardContent>
              </Card>
            )
          })}
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
                    <CardTitle className="text-base">Filter Leads</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>Clear All</Button>
                </div>
                <CardDescription>Refine your lead list by the criteria below.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input placeholder="Filter by lead..." value={leadNameFilter} onChange={e => setLeadNameFilter(e.target.value)} />
                <Input placeholder="Filter by company..." value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="Filter by status..." /></SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                 <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger><SelectValue placeholder="Filter by owner..." /></SelectTrigger>
                  <SelectContent>
                    {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                    <Input placeholder="Min value" type="number" value={valueFilter.min} onChange={e => setValueFilter(prev => ({...prev, min: e.target.value }))} />
                    <Input placeholder="Max value" type="number" value={valueFilter.max} onChange={e => setValueFilter(prev => ({...prev, max: e.target.value }))} />
                </div>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn("justify-start text-left font-normal", !dateFilter && "text-muted-foreground")}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFilter?.from ? (
                            dateFilter.to ? (
                            <>
                                {format(dateFilter.from, "LLL dd, y")} -{" "}
                                {format(dateFilter.to, "LLL dd, y")}
                            </>
                            ) : (
                            format(dateFilter.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Filter by enquiry date...</span>
                        )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateFilter?.from}
                        selected={dateFilter}
                        onSelect={setDateFilter}
                        numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        
        <Card>
          <div className="border-b">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.length > 0 ? paginatedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.companyName}</TableCell>
                    <TableCell>₹{lead.value.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(lead.status) as any}>{lead.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <AiLeadScorer lead={lead} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/leads/${lead.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleConvertToOpportunity(lead.name)}>
                            Convert to Opportunity
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between p-4">
              <div className="text-sm text-muted-foreground">
                  Showing {paginatedLeads.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                  {Math.min(currentPage * rowsPerPage, filteredLeads.length)} of {filteredLeads.length} leads.
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
                      disabled={currentPage === totalPages}
                  >
                      Next
                  </Button>
              </div>
          </div>
        </Card>
      </div>
      <AddLeadDialog isOpen={isAddLeadOpen} setIsOpen={setIsAddLeadOpen} />
    </div>
  );
}
