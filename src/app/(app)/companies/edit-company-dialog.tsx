
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditCompanyForm } from "./edit-company-form";
import type { EditCompanyFormValues } from "./edit-company-form";
import type { Company } from "@/lib/data";

export function EditCompanyDialog({
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
  const handleSave = (data: EditCompanyFormValues) => {
    onCompanyUpdated({ ...company, ...data });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update the details for "{company.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
          <EditCompanyForm
            company={company}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
