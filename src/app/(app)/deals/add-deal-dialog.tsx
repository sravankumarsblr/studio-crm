
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
import { products } from "@/lib/data";

export function AddOpportunityDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();

  const handleSave = (data: AddOpportunityFormValues) => {
    // In a real app, this would trigger a server action to save the new opportunity
    const totalValue = data.lineItems.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + (product?.price || 0) * item.quantity;
    }, 0);

    console.log("New opportunity to save:", { ...data, value: totalValue });

    toast({
      title: "Opportunity Created",
      description: `The opportunity "${data.name}" has been successfully created with a value of ₹${totalValue.toLocaleString('en-IN')}.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Opportunity</DialogTitle>
          <DialogDescription>
            Fill in the details for the new opportunity and add products to calculate its value.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
            <AddOpportunityForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

    