
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddQuoteForm, AddQuoteFormValues } from "./add-quote-form";
import type { Opportunity, Quote } from "@/lib/data";

type AddQuoteDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  opportunity: Opportunity;
  onQuoteAdded: (newQuote: Quote) => void;
};

export function AddQuoteDialog({
  isOpen,
  setIsOpen,
  opportunity,
  onQuoteAdded,
}: AddQuoteDialogProps) {

  const handleSave = (data: AddQuoteFormValues) => {
    const newQuote: Quote = {
      id: `qt${new Date().getTime()}`,
      quoteNumber: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      opportunityId: opportunity.id,
      date: new Date().toISOString().split("T")[0],
      expiryDate: data.expiryDate,
      preparedBy: "Alex Green", // In a real app, this would be the current user
      value: data.value,
      status: "Draft",
      documentName: data.document?.name,
      discount: (data.discountType && data.discountType !== 'none' && data.discountValue) ? {
        type: data.discountType as 'percentage' | 'fixed',
        value: data.discountValue
      } : undefined,
    };
    onQuoteAdded(newQuote);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Quote</DialogTitle>
          <DialogDescription>
            Create a new quote for the opportunity: "{opportunity.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddQuoteForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
