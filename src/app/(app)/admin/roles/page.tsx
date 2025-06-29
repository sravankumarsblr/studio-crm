
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { roles as initialRoles, type Role } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddRoleDialog } from "./add-role-dialog";
import { EditRoleDialog } from "./edit-role-dialog";

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleAdded = (newRole: Omit<Role, 'id'>) => {
    const roleToAdd: Role = {
        ...newRole,
        id: `role${new Date().getTime()}`,
    };
    setRoles(prev => [...prev, roleToAdd]);
  };

  const handleRoleUpdated = (updatedRole: Role) => {
    setRoles(roles.map(r => r.id === updatedRole.id ? updatedRole : r));
    setSelectedRole(null);
  };
  
  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setIsEditOpen(true);
  };

  const handleDelete = (roleId: string) => {
    setRoles(roles.filter(r => r.id !== roleId));
  };


  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Roles" actionText="Add Role" onActionClick={() => setIsAddOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-card rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(role)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(role.id)} className="text-destructive">
                            Delete
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
       <AddRoleDialog 
        isOpen={isAddOpen} 
        setIsOpen={setIsAddOpen} 
        onRoleAdded={handleRoleAdded} 
      />
      {selectedRole && (
        <EditRoleDialog
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            role={selectedRole}
            onRoleUpdated={handleRoleUpdated}
        />
      )}
    </>
  );
}

    