
"use client";

import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products } from "@/lib/data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type ProductSelectorDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onProductsAdded: (productIds: string[]) => void;
  initialSelectedIds?: string[];
};

export function ProductSelectorDialog({
  isOpen,
  setIsOpen,
  onProductsAdded,
  initialSelectedIds = []
}: ProductSelectorDialogProps) {
  const [stagedProductIds, setStagedProductIds] = useState<string[]>(initialSelectedIds);
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    if (isOpen) {
      setStagedProductIds(initialSelectedIds);
    }
  }, [isOpen, initialSelectedIds]);

  const productCategories = useMemo(() => {
    const categories = new Set(products.map(p => p.category));
    return ["All", ...Array.from(categories)];
  }, []);

  const availableProducts = useMemo(() => {
    return products.filter(p => {
        const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
        const searchMatch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
        return categoryMatch && searchMatch;
    });
  }, [selectedCategory, productSearch]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return availableProducts.slice(startIndex, startIndex + productsPerPage);
  }, [availableProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(availableProducts.length / productsPerPage);

  const handleToggleStagedProduct = (productId: string) => {
    setStagedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const handleAddProducts = () => {
    onProductsAdded(stagedProductIds);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setProductSearch("");
        setSelectedCategory("All");
        setCurrentPage(1);
      }
      setIsOpen(open);
    }}>
      <DialogContent className="sm:max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Products</DialogTitle>
          <DialogDescription>
            Select products to add. You can filter by category and search by name.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-6 flex-1 overflow-hidden">
          <div className="col-span-1 border-r pr-4 overflow-y-auto">
            <h4 className="text-sm font-medium mb-2">Level - 1</h4>
            <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-1">
              {productCategories.map(category => (
                <div key={category} className="flex items-center">
                  <RadioGroupItem value={category} id={`cat-${category}`} />
                  <Label htmlFor={`cat-${category}`} className="ml-2 text-sm font-normal">{category}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
            <Input 
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">NABL Price</TableHead>
                    <TableHead className="text-right">Non-NABL Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox 
                          checked={stagedProductIds.includes(product.id)}
                          onCheckedChange={() => handleToggleStagedProduct(product.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">
                        {product.nablPrice != null ? `₹${product.nablPrice.toLocaleString('en-IN')}` : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.nonNablPrice != null ? `₹${product.nonNablPrice.toLocaleString('en-IN')}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</Button>
                <span className="text-sm">Page {currentPage} of {totalPages > 0 ? totalPages : 1}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProducts}>Add {stagedProductIds.length} Products</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
