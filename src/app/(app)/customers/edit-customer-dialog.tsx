
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditCustomerForm } from "./edit-customer-form";
import type { EditCustomerFormValues } from "./edit-customer-form";
import type { Company as Customer } from "@/lib/data";

export function EditCustomerDialog({
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
  const handleSave = (data: EditCustomerFormValues) => {
    onCustomerUpdated({ ...customer, ...data });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>
            Update the details for "{customer.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <EditCustomerForm
            customer={customer}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
