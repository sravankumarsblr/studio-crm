
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddProductForm, type AddProductFormValues } from "./add-product-form";

export function AddProductDialog({
  isOpen,
  setIsOpen,
  onProductAdded,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onProductAdded: (newProduct: AddProductFormValues) => void;
}) {
  const handleSave = (data: AddProductFormValues) => {
    onProductAdded(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details for the new product.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
          <AddProductForm onSave={handleSave} onCancel={() => setIsOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
