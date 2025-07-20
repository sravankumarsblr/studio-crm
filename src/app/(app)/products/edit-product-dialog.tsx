
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditProductForm, type EditProductFormValues } from "./edit-product-form";
import type { Product } from "@/lib/data";

export function EditProductDialog({
  isOpen,
  setIsOpen,
  product,
  onProductUpdated,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: Product;
  onProductUpdated: (updatedProduct: Product) => void;
}) {
  const handleSave = (data: EditProductFormValues) => {
    onProductUpdated({ ...product, ...data });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the details for "{product.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
          <EditProductForm
            product={product}
            onSave={handleSave}
            onCancel={() => setIsOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
