
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddOpportunityForm } from "./add-deal-form";
import { useToast } from "@/hooks/use-toast";
import type { AddOpportunityFormValues } from "./add-deal-form";

export function AddOpportunityDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();

  const handleSave = (data: AddOpportunityFormValues) => {
    // In a real app, this would trigger a server action to save the new opportunity and its initial quote
    console.log("New opportunity to save:", data);

    toast({
      title: "Opportunity & Quote Created",
      description: `The opportunity "${data.name}" and an initial quote have been successfully created.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Opportunity</DialogTitle>
          <DialogDescription>
            Fill in the details for the new opportunity and its initial quote.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
            <AddOpportunityForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
