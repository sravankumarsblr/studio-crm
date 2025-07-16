
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditContactForm } from "./edit-contact-form";
import type { EditContactFormValues } from "./edit-contact-form";
import type { Contact } from "@/lib/data";

export function EditContactDialog({
  isOpen,
  setIsOpen,
  contact,
  onContactUpdated,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  contact: Contact;
  onContactUpdated: (updatedContact: Contact) => void;
}) {
  const handleSave = (data: EditContactFormValues) => {
    onContactUpdated({ ...contact, ...data });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>
            Update the details for "{contact.firstName} {contact.lastName}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
          <EditContactForm
            contact={contact}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

    