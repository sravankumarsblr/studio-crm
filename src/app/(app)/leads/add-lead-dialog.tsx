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

export function AddLeadDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();

  const handleSave = (data: AddLeadFormValues) => {
    // In a real app, this would trigger a server action to save the new lead
    // and potentially a deal, then re-fetch data.
    console.log("New lead to save:", data);

    if (data.convertToDeal) {
      toast({
        title: "Lead & Deal Created",
        description: `The lead "${data.name}" and a corresponding deal have been created.`,
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new lead. Select a company to see available contacts.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
            <AddLeadForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
