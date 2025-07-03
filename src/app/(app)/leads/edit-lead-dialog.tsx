
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditLeadForm } from "./edit-lead-form";
import { useToast } from "@/hooks/use-toast";
import type { EditLeadFormValues } from "./edit-lead-form";
import type { Lead } from "@/lib/data";
import { products } from "@/lib/data";

export function EditLeadDialog({
  isOpen,
  setIsOpen,
  lead,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  lead: Lead;
}) {
  const { toast } = useToast();

  const handleSave = (data: EditLeadFormValues) => {
    const totalValue = data.lineItems.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + (product?.price || 0) * item.quantity;
    }, 0);
    // In a real app, this would trigger a server action to update the lead.
    console.log("Updated lead data to save:", { ...data, value: totalValue });
    toast({
      title: "Lead Updated",
      description: `The lead "${data.name}" has been successfully updated.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
          <DialogDescription>
            Update the details for "{lead.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
            <EditLeadForm lead={lead} onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
