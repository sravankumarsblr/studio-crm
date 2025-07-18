
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddContactForm, type AddContactFormValues } from "./add-contact-form";
import type { Contact } from "@/lib/data";

export function AddContactDialog({
  isOpen,
  setIsOpen,
  onContactAdded,
  companyId,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onContactAdded: (newContact: Omit<Contact, 'id' | 'status' | 'avatar'> & { companyId?: string }) => void;
  companyId?: string;
}) {
  const handleSave = (data: AddContactFormValues) => {
    onContactAdded(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Enter the details for the new contact.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
          <AddContactForm onSave={handleSave} onCancel={() => setIsOpen(false)} companyId={companyId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
