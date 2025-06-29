
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddDealForm } from "./add-deal-form";
import { useToast } from "@/hooks/use-toast";
import type { AddDealFormValues } from "./add-deal-form";

export function AddDealDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();

  const handleSave = (data: AddDealFormValues) => {
    // In a real app, this would trigger a server action to save the new deal
    console.log("New deal to save:", data);

    toast({
      title: "Deal Created",
      description: `The deal "${data.name}" has been successfully created.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
          <DialogDescription>
            Fill in the details for the new deal.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
            <AddDealForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
