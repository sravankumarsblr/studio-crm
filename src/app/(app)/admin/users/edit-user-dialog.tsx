
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditUserForm } from "./edit-user-form";
import type { EditUserFormValues } from "./edit-user-form";
import type { User } from "@/lib/data";

export function EditUserDialog({
  isOpen,
  setIsOpen,
  user,
  onUserUpdated,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
  onUserUpdated: (updatedUser: User) => void;
}) {
  const handleSave = (data: EditUserFormValues) => {
    onUserUpdated({ ...user, ...data });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update details for {user.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <EditUserForm
            user={user}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

    