
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddRoleForm } from "./add-role-form";
import type { AddRoleFormValues } from "./add-role-form";

export function AddRoleDialog({
  isOpen,
  setIsOpen,
  onRoleAdded,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onRoleAdded: (newRole: AddRoleFormValues) => void;
}) {
  const handleSave = (data: AddRoleFormValues) => {
    onRoleAdded(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>
            Define a new role and its description.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddRoleForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

    