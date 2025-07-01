
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products as initialProducts, type Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddProductDialog } from "./add-product-dialog";
import { EditProductDialog } from "./edit-product-dialog";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleStatusChange = (productId: string, newStatus: boolean) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, status: newStatus ? 'active' : 'inactive' } : p
    ));
  };

  const handleProductAdded = (newProduct: Omit<Product, 'id' | 'status'>) => {
    const productToAdd: Product = {
        ...newProduct,
        id: `prod${new Date().getTime()}`,
        status: 'active',
    };
    setProducts(prev => [...prev, productToAdd]);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Products & Services" actionText="Add Product" onActionClick={() => setIsAddOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-card rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (INR)</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{product.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <Switch
                        id={`status-${product.id}`}
                        checked={product.status === 'active'}
                        onCheckedChange={(checked) => handleStatusChange(product.id, checked)}
                        aria-label="Product Status"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(product)}>
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
      <AddProductDialog 
        isOpen={isAddOpen} 
        setIsOpen={setIsAddOpen} 
        onProductAdded={handleProductAdded} 
      />
      {selectedProduct && (
        <EditProductDialog
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            product={selectedProduct}
            onProductUpdated={handleProductUpdated}
        />
      )}
    </>
  );
}
