
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditDealForm } from "./edit-deal-form";
import { useToast } from "@/hooks/use-toast";
import type { EditDealFormValues } from "./edit-deal-form";
import type { Deal } from "@/lib/data";

export function EditDealDialog({
  isOpen,
  setIsOpen,
  deal,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  deal: Deal;
}) {
  const { toast } = useToast();

  const handleSave = (data: EditDealFormValues) => {
    // In a real app, this would trigger a server action to update the deal.
    console.log("Updated deal data to save:", data);
    toast({
      title: "Deal Updated",
      description: `The deal "${data.name}" has been successfully updated.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
          <DialogDescription>
            Update the details for "{deal.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
            <EditDealForm deal={deal} onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
