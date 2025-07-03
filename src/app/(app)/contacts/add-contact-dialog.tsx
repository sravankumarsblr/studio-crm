
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
  onContactAdded: (newContact: Contact) => void;
  companyId?: string;
}) {
  const handleSave = (data: AddContactFormValues) => {
    const contactToAdd: Contact = {
      ...data,
      id: `con${new Date().getTime()}`,
      status: "active",
      avatar: "https://placehold.co/32x32.png",
    };
    onContactAdded(contactToAdd);
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
          <AddContactForm onSave={handleSave} onCancel={() => setIsOpen(false)} companyId={companyId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
