
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RaiseInvoiceForm, type RaiseInvoiceFormValues } from "./raise-invoice-form";
import type { Milestone } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type RaiseInvoiceDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  milestone: Milestone;
  onInvoiceRaised: (milestoneId: string, invoiceNumber: string) => void;
};

export function RaiseInvoiceDialog({ 
    isOpen, 
    setIsOpen, 
    milestone,
    onInvoiceRaised,
}: RaiseInvoiceDialogProps) {
  const { toast } = useToast();

  const handleSave = (data: RaiseInvoiceFormValues) => {
    onInvoiceRaised(milestone.id, data.invoiceNumber);
    toast({
      title: "Invoice Raised",
      description: `Invoice ${data.invoiceNumber} has been raised for milestone "${milestone.name}".`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raise Invoice for Milestone</DialogTitle>
          <DialogDescription>
            Enter the invoice number for "{milestone.name}". The invoice amount will be ₹{milestone.amount.toLocaleString('en-IN')}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RaiseInvoiceForm
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
