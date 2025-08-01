
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddMilestoneForm, type AddMilestoneFormValues } from "./add-milestone-form";
import type { Milestone, Contract } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type AddMilestoneDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  contract: Contract;
  onMilestoneAdded: (newMilestone: Omit<Milestone, 'id' | 'invoices'>) => void;
};

export function AddMilestoneDialog({ 
    isOpen, 
    setIsOpen, 
    onMilestoneAdded,
    contract,
}: AddMilestoneDialogProps) {
  const { toast } = useToast();
  const existingMilestoneTotal = contract.milestones.reduce((acc, m) => acc + m.amount, 0);

  const handleSave = (data: AddMilestoneFormValues) => {
    const newMilestone: Omit<Milestone, 'id' | 'invoices'> = {
        ...data,
        invoiceStatus: 'Not Invoiced',
    };
    onMilestoneAdded(newMilestone);
    toast({
      title: "Milestone Added",
      description: `The milestone "${data.name}" has been added to the contract.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Milestone</DialogTitle>
          <DialogDescription>
            Define a new milestone and associate products for this contract.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex-1 overflow-y-auto -mr-6 pr-6">
          <AddMilestoneForm
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)}
            contract={contract}
            existingMilestoneTotal={existingMilestoneTotal}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
