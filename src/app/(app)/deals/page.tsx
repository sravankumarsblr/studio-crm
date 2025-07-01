
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MoreHorizontal, ListFilter, Briefcase, BarChart, CheckCircle, XCircle } from "lucide-react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { opportunities as allOpportunities, users, type Opportunity } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { AddOpportunityDialog } from "./add-deal-dialog";
import { useToast } from "@/hooks/use-toast";

const OPPORTUNITY_STAGES = ['Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] as const;

const stageIcons: { [key in typeof OPPORTUNITY_STAGES[number]]: React.ElementType } = {
  Qualification: BarChart,
  Proposal: Briefcase,
  Negotiation: CheckCircle,
  'Closed Won': CheckCircle,
  'Closed Lost': XCircle,
};

const stageProgress: { [key: string]: number } = {
  'Qualification': 20,
  'Proposal': 50,
  'Negotiation': 75,
  'Closed Won': 100,
  'Closed Lost': 100,
};

const stageVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Qualification': 'outline',
  'Proposal': 'secondary',
  'Negotiation': 'default',
  'Closed Won': 'default',
  'Closed Lost': 'destructive',
};

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(allOpportunities);
  const [isAddOpportunityOpen, setIsAddOpportunityOpen] = useState(false);
  const { toast } = useToast();

  const [nameFilter, setNameFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [valueFilter, setValueFilter] = useState({ min: "", max: "" });
  const [ownerFilter, setOwnerFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const stageCounts = useMemo(() => {
    const counts: Record<typeof OPPORTUNITY_STAGES[number], number> = {
      'Qualification': 0,
      'Proposal': 0,
      'Negotiation': 0,
      'Closed Won': 0,
      'Closed Lost': 0,
    };
    for (const opportunity of allOpportunities) {
      if (counts[opportunity.stage] !== undefined) {
        counts[opportunity.stage]++;
      }
    }
    return counts;
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opportunity => {
      if (nameFilter && !opportunity.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
      if (companyFilter && !opportunity.companyName.toLowerCase().includes(companyFilter.toLowerCase())) return false;
      if (stageFilter && opportunity.stage !== stageFilter) return false;
      if (valueFilter.min && opportunity.value < Number(valueFilter.min)) return false;
      if (valueFilter.max && opportunity.value > Number(valueFilter.max)) return false;
      if (ownerFilter && opportunity.ownerId !== ownerFilter) return false;
      return true;
    });
  }, [opportunities, nameFilter, companyFilter, stageFilter, valueFilter, ownerFilter]);

  const paginatedOpportunities = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredOpportunities.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredOpportunities, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredOpportunities.length / rowsPerPage);

  const handleClearFilters = () => {
    setNameFilter('');
    setCompanyFilter('');
    setStageFilter('');
    setValueFilter({ min: "", max: "" });
    setOwnerFilter('');
    setCurrentPage(1);
  };
  
  const handleCloseAsWon = (opportunityName: string) => {
    toast({
      title: "Opportunity Updated",
      description: `"${opportunityName}" has been closed as won.`,
    });
    // Here you would typically update the state, but for this prototype we'll just show the toast
  };

  const handleCloseAsLost = (opportunityName: string) => {
    toast({
      title: "Opportunity Updated",
      description: `"${opportunityName}" has been closed as lost.`,
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Header title="Opportunities" actionText="Add Opportunity" onActionClick={() => setIsAddOpportunityOpen(true)} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {OPPORTUNITY_STAGES.map(stage => {
            const Icon = stageIcons[stage];
            return (
              <Card key={stage}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3">
                  <CardTitle className="text-sm font-medium">{stage}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-2xl font-bold">{stageCounts[stage]}</div>
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
                    <CardTitle className="text-base">Filter Opportunities</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>Clear All</Button>
                </div>
                <CardDescription>Refine your opportunities list by the criteria below.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input placeholder="Filter by opportunity name..." value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
                <Input placeholder="Filter by company..." value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} />
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger><SelectValue placeholder="Filter by stage..." /></SelectTrigger>
                  <SelectContent>
                    {OPPORTUNITY_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        
        <Card>
          <div className="border-b">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="w-[200px]">Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedOpportunities.length > 0 ? paginatedOpportunities.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">{opportunity.name}</TableCell>
                    <TableCell>{opportunity.companyName}</TableCell>
                    <TableCell>₹{opportunity.value.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Badge variant={stageVariant[opportunity.stage]}>{opportunity.stage}</Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={stageProgress[opportunity.stage]} className="h-2" />
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
                            <Link href={`/deals/${opportunity.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCloseAsWon(opportunity.name)}>
                            Close as Won
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCloseAsLost(opportunity.name)} className="text-destructive">
                            Close as Lost
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
                  Showing {paginatedOpportunities.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                  {Math.min(currentPage * rowsPerPage, filteredOpportunities.length)} of {filteredOpportunities.length} opportunities.
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
      <AddOpportunityDialog isOpen={isAddOpportunityOpen} setIsOpen={setIsAddOpportunityOpen} />
    </div>
  );
}
