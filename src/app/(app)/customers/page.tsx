
"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { companies as initialCustomers, type Company as Customer } from "@/lib/data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { AddCustomerDialog } from "./add-customer-dialog";
import { EditCustomerDialog } from "./edit-customer-dialog";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

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


  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Customers" actionText="Add Customer" onActionClick={() => setIsAddOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-card rounded-lg shadow-sm border">
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
                {customers.map((customer) => (
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
