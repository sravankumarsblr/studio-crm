
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditOpportunityForm } from "./edit-deal-form";
import { useToast } from "@/hooks/use-toast";
import type { EditOpportunityFormValues } from "./edit-deal-form";
import { products, type Opportunity } from "@/lib/data";

export function EditOpportunityDialog({
  isOpen,
  setIsOpen,
  opportunity,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  opportunity: Opportunity;
}) {
  const { toast } = useToast();

  const handleSave = (data: EditOpportunityFormValues) => {
    // In a real app, this would trigger a server action to update the opportunity.
    const totalValue = data.lineItems.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + (product?.price || 0) * item.quantity;
    }, 0);

    console.log("Updated opportunity data to save:", { ...data, value: totalValue });
    toast({
      title: "Opportunity Updated",
      description: `The opportunity "${data.name}" has been successfully updated.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Opportunity</DialogTitle>
          <DialogDescription>
            Update the details for "{opportunity.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
            <EditOpportunityForm opportunity={opportunity} onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
