"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { leads } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AiLeadScorer } from "./ai-lead-scorer";
import { AddLeadDialog } from "./add-lead-dialog";

export default function LeadsPage() {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Qualified': return 'default';
      case 'New': return 'outline';
      case 'Contacted': return 'secondary';
      case 'Lost': return 'destructive';
      default: return 'outline';
    }
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
                    <Button variant="ghost" size="sm">View</Button>
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
