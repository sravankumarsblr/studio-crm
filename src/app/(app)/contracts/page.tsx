
"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { contracts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SelectOpportunityDialog } from "./select-opportunity-dialog";

export default function ContractsPage() {
  const [isSelectOppOpen, setIsSelectOppOpen] = useState(false);
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Renewed': return 'default';
      case 'Draft': return 'secondary';
      case 'Terminated': return 'destructive';
      case 'Expired': return 'outline';
      default: return 'outline';
    }
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Contracts" actionText="Add Contract" onActionClick={() => setIsSelectOppOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-card rounded-lg shadow-sm border">
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
                {contracts.map((contract) => (
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
        </main>
      </div>
      <SelectOpportunityDialog isOpen={isSelectOppOpen} setIsOpen={setIsSelectOppOpen} />
    </>
  );
}
