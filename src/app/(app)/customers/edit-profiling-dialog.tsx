
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditProfilingForm, type EditProfilingFormValues } from "./edit-profiling-form";
import type { Company as Customer } from "@/lib/data";

export function EditProfilingDialog({
  isOpen,
  setIsOpen,
  customer,
  onCustomerUpdated,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  customer: Customer;
  onCustomerUpdated: (updatedProduct: Customer) => void;
}) {
  const handleSave = (data: EditProfilingFormValues) => {
    onCustomerUpdated({ ...customer, ...data });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Customer Profiling</DialogTitle>
          <DialogDescription>
            Update the profiling details for "{customer.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <EditProfilingForm
            customer={customer}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
