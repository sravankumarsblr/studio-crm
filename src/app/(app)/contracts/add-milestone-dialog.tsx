
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddMilestoneForm, type AddMilestoneFormValues } from "./add-milestone-form";
import type { Milestone } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type AddMilestoneDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  contractId: string;
  contractValue: number;
  existingMilestoneTotal: number;
  onMilestoneAdded: (newMilestone: Omit<Milestone, 'id' | 'invoices'>) => void;
};

export function AddMilestoneDialog({ 
    isOpen, 
    setIsOpen, 
    onMilestoneAdded,
    contractValue,
    existingMilestoneTotal
}: AddMilestoneDialogProps) {
  const { toast } = useToast();

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Milestone</DialogTitle>
          <DialogDescription>
            Define a new milestone for this contract.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddMilestoneForm
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)}
            contractValue={contractValue}
            existingMilestoneTotal={existingMilestoneTotal}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
