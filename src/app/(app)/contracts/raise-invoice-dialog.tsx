
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RaiseInvoiceForm, type RaiseInvoiceFormValues } from "./raise-invoice-form";
import type { Milestone, Invoice, Contract } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type RaiseInvoiceDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  milestone: Milestone;
  contract: Contract;
  onInvoiceRaised: (milestoneId: string, newInvoice: Omit<Invoice, 'id' | 'raisedById'>) => void;
};

export function RaiseInvoiceDialog({ 
    isOpen, 
    setIsOpen, 
    milestone,
    contract,
    onInvoiceRaised,
}: RaiseInvoiceDialogProps) {
  const { toast } = useToast();

  const handleSave = (data: RaiseInvoiceFormValues) => {
    const totalAmount = data.lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    
    const newInvoice: Omit<Invoice, 'id' | 'raisedById'> = {
        invoiceNumber: data.invoiceNumber,
        amount: totalAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'Invoiced',
        documentName: data.invoiceDocument?.name,
        lineItems: data.lineItems,
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Raise Invoice for Milestone</DialogTitle>
          <DialogDescription>
            Raise a full or partial invoice for "{milestone.name}".
            The remaining amount on this milestone is ₹{remainingAmount.toLocaleString('en-IN')}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
          <RaiseInvoiceForm
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)}
            milestone={milestone}
            contract={contract}
            remainingAmount={remainingAmount}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
