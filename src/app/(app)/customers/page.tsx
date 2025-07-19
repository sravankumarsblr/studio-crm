
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { companies as initialCustomers, type Company as Customer } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoreHorizontal, ListFilter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { AddCustomerDialog } from "./add-customer-dialog";
import { EditCustomerDialog } from "./edit-customer-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const customerIndustries = [...new Set(initialCustomers.map(c => c.industry))];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Filter and pagination states
  const [nameFilter, setNameFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const handleStatusChange = (customerId: string, newStatus: boolean) => {
    setCustomers(customers.map(c => 
      c.id === customerId ? { ...c, status: newStatus ? 'active' : 'inactive' } : c
    ));
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(null);
  };
  
  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditOpen(true);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      if (nameFilter && !customer.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
      if (industryFilter && customer.industry !== industryFilter) return false;
      if (statusFilter && customer.status !== statusFilter) return false;
      return true;
    });
  }, [customers, nameFilter, industryFilter, statusFilter]);
  
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCustomers, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  const handleClearFilters = () => {
    setNameFilter('');
    setIndustryFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };


  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Customers" actionText="Add Customer" onActionClick={() => setIsAddOpen(true)} />
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
                    <CardTitle className="text-base">Filter Customers</CardTitle>
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>Clear All</Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Filter by name..." value={nameFilter} onChange={e => setNameFilter(e.target.value)} />
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger><SelectValue placeholder="Filter by industry..." /></SelectTrigger>
                    <SelectContent>
                      {customerIndustries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                    <TableHead className="w-[80px]">Logo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Image src={customer.logo} alt={customer.name} width={40} height={40} className="rounded-md" data-ai-hint="logo" />
                      </TableCell>
                      <TableCell className="font-medium">
                          <Link href={`/customers/${customer.id}`} className="hover:underline text-primary">
                            {customer.name}
                          </Link>
                      </TableCell>
                      <TableCell>{customer.industry}</TableCell>
                      <TableCell>
                        <Link href={customer.website} target="_blank" className="text-primary hover:underline">
                          {customer.website.replace('https://', '')}
                        </Link>
                      </TableCell>
                      <TableCell>{customer.numberOfEmployees}</TableCell>
                      <TableCell>
                         <Switch
                          id={`status-${customer.id}`}
                          checked={customer.status === 'active'}
                          onCheckedChange={(checked) => handleStatusChange(customer.id, checked)}
                          aria-label="Customer Status"
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
                            <DropdownMenuItem asChild>
                              <Link href={`/customers/${customer.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(customer)}>
                              Edit Basic Info
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="text-sm text-muted-foreground">
                  Showing {paginatedCustomers.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-
                  {Math.min(currentPage * rowsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers.
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
       <AddCustomerDialog 
        isOpen={isAddOpen} 
        setIsOpen={setIsAddOpen} 
        onCustomerCreated={handleCustomerAdded} 
      />
      {selectedCustomer && (
        <EditCustomerDialog
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            customer={selectedCustomer}
            onCustomerUpdated={handleCustomerUpdated}
        />
      )}
    </>
  );
}
