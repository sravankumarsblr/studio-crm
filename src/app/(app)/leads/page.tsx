
"use client";

import { useState } from "react";
import Link from 'next/link';
import { MoreHorizontal } from "lucide-react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { leads } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AiLeadScorer } from "./ai-lead-scorer";
import { AddLeadDialog } from "./add-lead-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function LeadsPage() {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const { toast } = useToast();

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
    // In a real app, this would trigger a server action
    console.log(`Converting ${leadName} to an opportunity.`);
    toast({
      title: "Lead Converted",
      description: `A new opportunity has been created for "${leadName}".`,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Leads" actionText="Add Lead" onActionClick={() => setIsAddLeadOpen(true)} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-card rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.companyName}</TableCell>
                  <TableCell>${lead.value.toLocaleString()}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <AddLeadDialog isOpen={isAddLeadOpen} setIsOpen={setIsAddLeadOpen} />
    </div>
  );
}
