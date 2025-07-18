
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
import { contracts, type Contract, type Milestone, type Invoice } from "@/lib/data";
import { RaiseInvoiceDialog } from "@/app/(app)/contracts/raise-invoice-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectMilestoneDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onInvoiceRaised: (contractId: string, milestoneId: string, newInvoice: Omit<Invoice, 'id' | 'raisedById'>) => void;
};

export function SelectMilestoneDialog({ isOpen, setIsOpen, onInvoiceRaised }: SelectMilestoneDialogProps) {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isRaiseInvoiceOpen, setIsRaiseInvoiceOpen] = useState(false);
  const [contractOpen, setContractOpen] = useState(false);

  const handleSelectMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsRaiseInvoiceOpen(true);
    // Don't close this dialog yet, so it re-opens if the raise invoice dialog is cancelled.
  };

  const handleInvoiceRaisedAndClose = (milestoneId: string, newInvoice: Omit<Invoice, 'id' | 'raisedById'>) => {
    if (selectedContract) {
      onInvoiceRaised(selectedContract.id, milestoneId, newInvoice);
    }
    // Close all dialogs
    setIsRaiseInvoiceOpen(false);
    setSelectedMilestone(null);
    setSelectedContract(null);
    setIsOpen(false);
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
        setSelectedContract(null);
        setSelectedMilestone(null);
    }
    setIsOpen(open);
  }

  const invoiceableMilestones = selectedContract?.milestones.filter(
    m => m.invoiceStatus !== 'Paid' && m.invoiceStatus !== 'Invoiced'
  ) || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select a Milestone to Invoice</DialogTitle>
            <DialogDescription>
              Choose a contract, then select an invoiceable milestone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <Popover open={contractOpen} onOpenChange={setContractOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={contractOpen} className="w-full justify-between">
                    {selectedContract ? selectedContract.contractTitle : "Select contract..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                    <CommandInput placeholder="Search contract..." />
                    <CommandList>
                        <CommandEmpty>No contract found.</CommandEmpty>
                        <CommandGroup>
                        {contracts.map((contract) => (
                            <CommandItem
                            value={contract.contractTitle}
                            key={contract.id}
                            onSelect={() => {
                                setSelectedContract(contract);
                                setContractOpen(false);
                            }}
                            >
                            <Check className={cn("mr-2 h-4 w-4", contract.id === selectedContract?.id ? "opacity-100" : "opacity-0")} />
                            {contract.contractTitle}
                            </CommandItem>
                        ))}
                        </CommandGroup>
                    </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className="max-h-[60vh] overflow-y-auto border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Milestone</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Invoice Status</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoiceableMilestones.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    {selectedContract ? "No invoiceable milestones." : "Please select a contract."}
                                </TableCell>
                            </TableRow>
                        )}
                        {invoiceableMilestones.map(milestone => (
                            <TableRow key={milestone.id}>
                                <TableCell className="font-medium">{milestone.name}</TableCell>
                                <TableCell>₹{milestone.amount.toLocaleString('en-IN')}</TableCell>
                                <TableCell>{milestone.invoiceStatus}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" onClick={() => handleSelectMilestone(milestone)}>Select</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedMilestone && selectedContract && (
        <RaiseInvoiceDialog
          isOpen={isRaiseInvoiceOpen}
          setIsOpen={setIsRaiseInvoiceOpen}
          milestone={selectedMilestone}
          contract={selectedContract}
          onInvoiceRaised={handleInvoiceRaisedAndClose}
        />
      )}
    </>
  );
}
