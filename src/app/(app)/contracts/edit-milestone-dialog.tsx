
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditMilestoneForm, type EditMilestoneFormValues } from "./edit-milestone-form";
import type { Milestone, Contract } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type EditMilestoneDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  milestone: Milestone;
  contract: Contract;
  onMilestoneUpdated: (updatedMilestone: Milestone) => void;
};

export function EditMilestoneDialog({ 
    isOpen, 
    setIsOpen, 
    milestone,
    contract,
    onMilestoneUpdated,
}: EditMilestoneDialogProps) {
  const { toast } = useToast();
  const existingMilestoneTotal = contract.milestones
    .filter(m => m.id !== milestone.id)
    .reduce((acc, m) => acc + m.amount, 0);

  const handleSave = (data: EditMilestoneFormValues) => {
    const updatedMilestone: Milestone = {
        ...milestone,
        ...data,
    };
    onMilestoneUpdated(updatedMilestone);
    toast({
      title: "Milestone Updated",
      description: `The milestone "${data.name}" has been updated.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Milestone</DialogTitle>
          <DialogDescription>
            Update the details for milestone: "{milestone.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex-1 overflow-y-auto -mr-6 pr-6">
          <EditMilestoneForm
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)}
            contract={contract}
            milestone={milestone}
            existingMilestoneTotal={existingMilestoneTotal}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
