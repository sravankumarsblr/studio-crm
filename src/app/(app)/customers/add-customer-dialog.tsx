
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddCustomerForm } from "./add-customer-form";
import type { AddCustomerFormValues } from "./add-customer-form";
import type { Company as Customer } from "@/lib/data";

export function AddCustomerDialog({
  isOpen,
  setIsOpen,
  onCustomerCreated,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCustomerCreated: (newCustomer: Customer) => void;
}) {
  const handleSave = (data: AddCustomerFormValues) => {
    const newCustomer: Customer = {
      ...data,
      id: `com${new Date().getTime()}`,
      logo: 'https://placehold.co/40x40.png',
      status: 'active',
    };
    onCustomerCreated(newCustomer);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Enter the details for the new customer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AddCustomerForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
