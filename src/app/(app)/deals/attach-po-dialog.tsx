
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AttachPoForm, type AttachPoFormValues } from "./attach-po-form";
import type { Quote } from "@/lib/data";

type AttachPoDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  quote: Quote;
  onPoAttached: (quoteId: string, poDetails: AttachPoFormValues) => void;
};

export function AttachPoDialog({
  isOpen,
  setIsOpen,
  quote,
  onPoAttached,
}: AttachPoDialogProps) {

  const handleSave = (data: AttachPoFormValues) => {
    onPoAttached(quote.id, data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Attach Purchase Order</DialogTitle>
          <DialogDescription>
            Attach the PO for quote {quote.quoteNumber} and mark it as accepted.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AttachPoForm 
            quote={quote}
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
