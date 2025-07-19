
"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { contracts as allContracts, companies, type Contract, type Milestone, type Invoice } from "@/lib/data";
import { RaiseInvoiceDialog } from "@/app/(app)/contracts/raise-invoice-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

type SelectMilestoneDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onInvoiceRaised: (contractId: string, milestoneId: string, newInvoice: Omit<Invoice, 'id' | 'raisedById'>) => void;
};

export function SelectMilestoneDialog({ isOpen, setIsOpen, onInvoiceRaised }: SelectMilestoneDialogProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<typeof companies[number] | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isRaiseInvoiceOpen, setIsRaiseInvoiceOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [contractOpen, setContractOpen] = useState(false);
  const [stagedMilestones, setStagedMilestones] = useState<Milestone[]>([]);
  
  const filteredContracts = useMemo(() => {
    if (!selectedCustomer) return allContracts;
    return allContracts.filter(c => c.companyName === selectedCustomer.name);
  }, [selectedCustomer]);
  
  const handleRaiseForSelectedClick = () => {
    if (stagedMilestones.length > 0) {
      // For now, let's assume we create a combined invoice.
      // We will open the dialog with the first selected milestone,
      // but a real implementation might need a more complex dialog
      // that can handle multiple milestones distinctly.
      setSelectedMilestone(stagedMilestones[0]);
      setIsRaiseInvoiceOpen(true);
    }
  };
  
  const handleRaiseForSingleClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setStagedMilestones([milestone]);
    setIsRaiseInvoiceOpen(true);
  };
  
  const handleToggleStagedMilestone = (milestone: Milestone) => {
    setStagedMilestones((prev) =>
      prev.some(m => m.id === milestone.id)
        ? prev.filter((m) => m.id !== milestone.id)
        : [...prev, milestone]
    );
  };


  const handleInvoiceRaisedAndClose = (milestoneId: string, newInvoice: Omit<Invoice, 'id' | 'raisedById'>) => {
    if (selectedContract) {
      onInvoiceRaised(selectedContract.id, milestoneId, newInvoice);
    }
    // Close all dialogs
    setIsRaiseInvoiceOpen(false);
    setSelectedMilestone(null);
    setSelectedContract(null);
    setStagedMilestones([]);
    setIsOpen(false);
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
        setSelectedCustomer(null);
        setSelectedContract(null);
        setSelectedMilestone(null);
        setStagedMilestones([]);
    }
    setIsOpen(open);
  }

  const invoiceableMilestones = selectedContract?.milestones.filter(
    m => m.invoiceStatus !== 'Paid' && m.invoiceStatus !== 'Invoiced'
  ) || [];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Milestone(s) to Invoice</DialogTitle>
            <DialogDescription>
              Choose a customer and contract, then select one or more invoiceable milestones.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={customerOpen} className="w-full justify-between">
                        {selectedCustomer ? selectedCustomer.name : "Select customer..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                        <CommandInput placeholder="Search customer..." />
                        <CommandList>
                            <CommandEmpty>No customer found.</CommandEmpty>
                            <CommandGroup>
                            {companies.map((customer) => (
                                <CommandItem
                                value={customer.name}
                                key={customer.id}
                                onSelect={() => {
                                    setSelectedCustomer(customer);
                                    setSelectedContract(null); // Reset contract on new customer
                                    setStagedMilestones([]);
                                    setCustomerOpen(false);
                                }}
                                >
                                <Check className={cn("mr-2 h-4 w-4", customer.id === selectedCustomer?.id ? "opacity-100" : "opacity-0")} />
                                {customer.name}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <Popover open={contractOpen} onOpenChange={setContractOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" aria-expanded={contractOpen} className="w-full justify-between" disabled={!selectedCustomer}>
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
                            {filteredContracts.map((contract) => (
                                <CommandItem
                                value={contract.contractTitle}
                                key={contract.id}
                                onSelect={() => {
                                    setSelectedContract(contract);
                                    setStagedMilestones([]);
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
            </div>

            <div className="max-h-[50vh] overflow-y-auto border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Milestone</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Invoiced</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoiceableMilestones.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    {selectedContract ? "No invoiceable milestones." : "Please select a contract."}
                                </TableCell>
                            </TableRow>
                        )}
                        {invoiceableMilestones.map(milestone => {
                          const invoicedAmount = milestone.invoices.reduce((sum, inv) => sum + inv.amount, 0);
                          const balanceAmount = milestone.amount - invoicedAmount;
                          return (
                            <TableRow key={milestone.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={stagedMilestones.some(m => m.id === milestone.id)}
                                        onCheckedChange={() => handleToggleStagedMilestone(milestone)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{milestone.name}</TableCell>
                                <TableCell>₹{milestone.amount.toLocaleString('en-IN')}</TableCell>
                                <TableCell>₹{invoicedAmount.toLocaleString('en-IN')}</TableCell>
                                <TableCell>₹{balanceAmount.toLocaleString('en-IN')}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => handleRaiseForSingleClick(milestone)}>
                                        Raise Invoice
                                    </Button>
                                </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                </Table>
            </div>
          </div>
           <DialogFooter>
            <Button variant="outline" onClick={() => handleDialogClose(false)}>Cancel</Button>
            <Button onClick={handleRaiseForSelectedClick} disabled={stagedMilestones.length === 0}>
              Raise Invoice for Selected ({stagedMilestones.length})
            </Button>
          </DialogFooter>
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
