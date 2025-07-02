
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddContactForm, type AddContactFormValues } from "./add-contact-form";

export function AddContactDialog({
  isOpen,
  setIsOpen,
  onContactAdded,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onContactAdded: (newContact: AddContactFormValues) => void;
}) {
  const handleSave = (data: AddContactFormValues) => {
    onContactAdded(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Enter the details for the new contact.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddContactForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
