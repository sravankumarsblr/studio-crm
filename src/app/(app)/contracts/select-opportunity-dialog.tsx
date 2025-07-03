
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { opportunities, type Opportunity } from "@/lib/data";
import { AddContractDialog } from "./add-contract-dialog";

type SelectOpportunityDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export function SelectOpportunityDialog({ isOpen, setIsOpen }: SelectOpportunityDialogProps) {
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  
  const wonOpportunities = opportunities.filter(o => o.status === 'Won');

  const handleSelect = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setIsContractDialogOpen(true);
    setIsOpen(false); // Close this dialog
  };

  const handleContractDialogClose = (open: boolean) => {
    if (!open) {
        setSelectedOpp(null);
    }
    setIsContractDialogOpen(open);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select a Won Opportunity</DialogTitle>
            <DialogDescription>
              Choose a "Won" opportunity to create a new contract from.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="max-h-[60vh] overflow-y-auto border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Opportunity Name</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {wonOpportunities.map(opp => (
                            <TableRow key={opp.id}>
                                <TableCell className="font-medium">{opp.name}</TableCell>
                                <TableCell>{opp.companyName}</TableCell>
                                <TableCell>₹{opp.value.toLocaleString('en-IN')}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={() => handleSelect(opp)}>Select</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedOpp && (
        <AddContractDialog
          isOpen={isContractDialogOpen}
          setIsOpen={handleContractDialogClose}
          opportunity={selectedOpp}
        />
      )}
    </>
  );
}
