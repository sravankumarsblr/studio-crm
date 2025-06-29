
"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { opportunities } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddOpportunityDialog } from "./add-deal-dialog";

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
  const [isAddOpportunityOpen, setIsAddOpportunityOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <Header title="Opportunities" actionText="Add Opportunity" onActionClick={() => setIsAddOpportunityOpen(true)} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-card rounded-lg shadow-sm border">
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
              {opportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell className="font-medium">{opportunity.name}</TableCell>
                  <TableCell>{opportunity.companyName}</TableCell>
                  <TableCell>${opportunity.value.toLocaleString()}</TableCell>
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
                        <DropdownMenuItem>Close as Won</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Close as Lost</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
      <AddOpportunityDialog isOpen={isAddOpportunityOpen} setIsOpen={setIsAddOpportunityOpen} />
    </div>
  );
}
