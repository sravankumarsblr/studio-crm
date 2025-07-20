
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GenerateQuoteForm, type GenerateQuoteFormValues } from "./add-quote-form";
import type { Opportunity, Quote } from "@/lib/data";
import { users } from "@/lib/data";


type GenerateQuoteDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  opportunity: Opportunity;
  onQuoteAdded: (newQuote: Quote) => void;
};

export function GenerateQuoteDialog({
  isOpen,
  setIsOpen,
  opportunity,
  onQuoteAdded,
}: GenerateQuoteDialogProps) {

  const handleSave = (data: GenerateQuoteFormValues) => {
    // In a real app, the current user would be derived from session
    const currentUser = users.find(u => u.role === 'Admin') || users[0];

    const totals = data.lineItems.reduce((acc, item) => {
      const originalLineTotal = item.unitPrice * item.quantity;
      const finalLineTotal = item.finalUnitPrice * item.quantity;
      acc.subtotal += originalLineTotal;
      acc.discount += (originalLineTotal - finalLineTotal);
      acc.totalBeforeGst += finalLineTotal;
      return acc;
    }, { subtotal: 0, discount: 0, totalBeforeGst: 0 });

    const newQuote: Quote = {
      id: `qt${new Date().getTime()}`,
      quoteNumber: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      opportunityId: opportunity.id,
      date: new Date().toISOString().split("T")[0],
      expiryDate: data.expiryDate,
      preparedBy: currentUser.name,
      status: data.attachPo ? "Accepted" : "Draft",
      documentName: data.document?.name,
      subtotal: totals.subtotal,
      discount: totals.discount,
      gstRate: data.gstRate,
      showGst: data.showGst,
      lineItems: data.lineItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        finalUnitPrice: item.finalUnitPrice,
      })),
      poNumber: data.attachPo ? data.poNumber : undefined,
      poValue: data.attachPo ? data.poValue : undefined,
      poDate: data.attachPo ? data.poDate : undefined,
      poStatus: data.attachPo ? data.poStatus : undefined,
      poDocumentName: data.attachPo ? data.poDocument?.name : undefined,
    };
    onQuoteAdded(newQuote);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Generate Quote</DialogTitle>
          <DialogDescription>
            Review the line items and generate a new quote for the opportunity: "{opportunity.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
          <GenerateQuoteForm 
            opportunity={opportunity}
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
