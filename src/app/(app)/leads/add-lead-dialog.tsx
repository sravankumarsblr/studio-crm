"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddLeadForm } from "./add-lead-form";
import { useToast } from "@/hooks/use-toast";
import type { AddLeadFormValues } from "./add-lead-form";
import { products } from "@/lib/data";

export function AddLeadDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();

  const handleSave = (data: AddLeadFormValues) => {
    const totalValue = data.lineItems.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + (product?.price || 0) * item.quantity;
    }, 0);

    // In a real app, this would trigger a server action to save the new lead
    // and potentially a opportunity, then re-fetch data.
    console.log("New lead to save:", { ...data, value: totalValue });

    if (data.convertToOpportunity) {
      toast({
        title: "Lead & Opportunity Created",
        description: `The lead "${data.name}" and a corresponding opportunity have been created.`,
      });
    } else {
      toast({
        title: "Lead Created",
        description: `The lead "${data.name}" has been successfully created.`,
      });
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Fill in the details below. You can select multiple contacts and designate one as primary.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
            <AddLeadForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
