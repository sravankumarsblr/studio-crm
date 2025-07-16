
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditProfilingForm, type EditProfilingFormValues } from "./edit-profiling-form";
import type { Company } from "@/lib/data";

export function EditProfilingDialog({
  isOpen,
  setIsOpen,
  company,
  onCompanyUpdated,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  company: Company;
  onCompanyUpdated: (updatedProduct: Company) => void;
}) {
  const handleSave = (data: EditProfilingFormValues) => {
    onCompanyUpdated({ ...company, ...data });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Company Profiling</DialogTitle>
          <DialogDescription>
            Update the profiling details for "{company.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <EditProfilingForm
            company={company}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
