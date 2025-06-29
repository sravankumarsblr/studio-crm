"use client";

import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
    const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Contract': return 'default';
      case 'Lead': return 'outline';
      case 'Deal': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Product Lifecycle" actionText="Add Product" onActionClick={() => {}} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-card rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Lifecycle Stage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>
                     <Badge variant={getStatusVariant(product.lifecycleStage) as any}>{product.lifecycleStage}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
