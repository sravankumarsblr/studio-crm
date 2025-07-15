
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddCompanyForm } from "./add-company-form";
import type { AddCompanyFormValues } from "./add-company-form";
import type { Company } from "@/lib/data";

export function AddCompanyDialog({
  isOpen,
  setIsOpen,
  onCompanyCreated,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCompanyCreated: (newCompany: Company) => void;
}) {
  const handleSave = (data: AddCompanyFormValues) => {
    const newCompany: Company = {
      ...data,
      id: `com${new Date().getTime()}`,
      logo: 'https://placehold.co/40x40.png',
      status: 'active',
    };
    onCompanyCreated(newCompany);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Enter the details for the new company.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddCompanyForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
