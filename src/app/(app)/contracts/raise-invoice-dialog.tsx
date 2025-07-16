
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RaiseInvoiceForm, type RaiseInvoiceFormValues } from "./raise-invoice-form";
import type { Milestone, Invoice } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type RaiseInvoiceDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  milestone: Milestone;
  onInvoiceRaised: (milestoneId: string, newInvoice: Omit<Invoice, 'id' | 'raisedById'>) => void;
};

export function RaiseInvoiceDialog({ 
    isOpen, 
    setIsOpen, 
    milestone,
    onInvoiceRaised,
}: RaiseInvoiceDialogProps) {
  const { toast } = useToast();

  const handleSave = (data: RaiseInvoiceFormValues) => {
    const newInvoice: Omit<Invoice, 'id' | 'raisedById'> = {
        number: data.invoiceNumber,
        amount: data.invoiceAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'Invoiced',
        documentName: data.invoiceDocument?.name,
    };
    onInvoiceRaised(milestone.id, newInvoice);
    toast({
      title: "Invoice Raised",
      description: `Invoice ${data.invoiceNumber} has been raised for milestone "${milestone.name}".`,
    });
    setIsOpen(false);
  };
  
  const totalInvoiced = milestone.invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const remainingAmount = milestone.amount - totalInvoiced;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Raise Invoice for Milestone</DialogTitle>
          <DialogDescription>
            Raise a full or partial invoice for "{milestone.name}".
            The remaining amount on this milestone is ₹{remainingAmount.toLocaleString('en-IN')}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RaiseInvoiceForm
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)}
            remainingAmount={remainingAmount}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
