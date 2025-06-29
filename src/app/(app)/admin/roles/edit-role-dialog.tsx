
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditRoleForm } from "./edit-role-form";
import type { EditRoleFormValues } from "./edit-role-form";
import type { Role } from "@/lib/data";

export function EditRoleDialog({
  isOpen,
  setIsOpen,
  role,
  onRoleUpdated,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  role: Role;
  onRoleUpdated: (updatedRole: Role) => void;
}) {
  const handleSave = (data: EditRoleFormValues) => {
    onRoleUpdated({ ...role, ...data });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
          <DialogDescription>
            Update the details for the "{role.name}" role.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <EditRoleForm
            role={role}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

    