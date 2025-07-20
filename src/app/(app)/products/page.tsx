
"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products as initialProducts, type Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, ListFilter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddProductDialog } from "./add-product-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";


const productCategories = [
  "Sensors",
  "Scales",
  "Tools",
  "Lab Equipment",
  "Weighing Machine Calibration Services",
  "Weight Calibration Services",
  "Electrical Instruments Calibration Services",
  "Dimensional Calibration Services",
  "Pressure Gauge and Vacuum Gauges Calibration Services",
  "Autoclave Calibration Services",
  "Flow Meter Calibration Services",
  "Tachometer & Sound Level Meter Calibration Services",
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter and pagination states
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);


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
    setSelectedProduct(null);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
        if (nameFilter && !product.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
        if (categoryFilter && product.category !== categoryFilter) return false;
        if (statusFilter && product.status !== statusFilter) return false;
        return true;
    });
  }, [products, nameFilter, categoryFilter, statusFilter]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredProducts, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const handleClearFilters = () => {
    setNameFilter('');
    setCategoryFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Products & Services" actionText="Add Product / Service" onActionClick={() => setIsAddOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <Collapsible className="space-y-4">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <ListFilter className="mr-2 h-4 w-4" />
                Toggle Filters
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Filter Products & Services</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>Clear All</Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Filter by name..." value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by category..." /></SelectTrigger>
                    <SelectContent>
                      {productCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by status..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <Card>
            <div className="border-b">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Level - 1</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>NABL</TableHead>
                    <TableHead>NABL Price</TableHead>
                    <TableHead>Non-NABL Price</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.length > 0 ? paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.location}</TableCell>
                      <TableCell>
                        <Badge variant={product.isNabl ? "default" : "secondary"}>
                          {product.isNabl ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{product.nablPrice?.toLocaleString('en-IN') ?? '-'}</TableCell>
                      <TableCell>₹{product.nonNablPrice?.toLocaleString('en-IN') ?? '-'}</TableCell>
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
                  )) : (
                     <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No results found.
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
             <div className="flex items-center justify-between p-4">
              <div className="text-sm text-muted-foreground">
                  Showing {paginatedProducts.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                  {Math.min(currentPage * rowsPerPage, filteredProducts.length)} of {filteredProducts.length} products.
              </div>
              <div className="flex items-center gap-2">
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                  >
                      Previous
                  </Button>
                  <span className="text-sm">
                      Page {currentPage} of {totalPages > 0 ? totalPages : 1}
                  </span>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                  >
                      Next
                  </Button>
              </div>
            </div>
          </Card>
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
