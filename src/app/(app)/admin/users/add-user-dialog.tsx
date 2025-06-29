
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddUserForm } from "./add-user-form";
import type { AddUserFormValues } from "./add-user-form";

export function AddUserDialog({
  isOpen,
  setIsOpen,
  onUserAdded,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onUserAdded: (newUser: AddUserFormValues) => void;
}) {
  const handleSave = (data: AddUserFormValues) => {
    onUserAdded({ ...data, avatar: 'https://placehold.co/32x32.png' });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Invite a new user and assign them a role.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddUserForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

    