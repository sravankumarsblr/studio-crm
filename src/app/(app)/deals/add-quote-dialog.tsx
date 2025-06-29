
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
    const newQuote: Quote = {
      id: `qt${new Date().getTime()}`,
      quoteNumber: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      opportunityId: opportunity.id,
      date: new Date().toISOString().split("T")[0],
      expiryDate: data.expiryDate,
      preparedBy: "Alex Green", // In a real app, this would be the current user
      value: data.value,
      status: data.attachPo ? "Accepted" : "Draft",
      documentName: data.document?.name,
      discount: (data.discountType && data.discountType !== 'none' && data.discountValue) ? {
        type: data.discountType as 'percentage' | 'fixed',
        value: data.discountValue
      } : undefined,
      poNumber: data.attachPo ? data.poNumber : undefined,
      poValue: data.attachPo ? data.poValue : undefined,
      poDate: data.attachPo ? data.poDate : undefined,
      poDocumentName: data.attachPo ? data.poDocument?.name : undefined,
    };
    onQuoteAdded(newQuote);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
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
