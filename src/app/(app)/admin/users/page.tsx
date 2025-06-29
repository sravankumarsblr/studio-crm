
"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users as initialUsers, type User } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AddUserDialog } from "./add-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserAdded = (newUser: Omit<User, 'id'>) => {
    const userToAdd: User = {
        ...newUser,
        id: `user${new Date().getTime()}`,
    };
    setUsers(prev => [...prev, userToAdd]);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setSelectedUser(null);
  };
  
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };


  return (
    <>
      <div className="flex flex-col h-full">
        <Header title="Users" actionText="Add User" onActionClick={() => setIsAddOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-card rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Avatar</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(user)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
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
       <AddUserDialog 
        isOpen={isAddOpen} 
        setIsOpen={setIsAddOpen} 
        onUserAdded={handleUserAdded} 
      />
      {selectedUser && (
        <EditUserDialog
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            user={selectedUser}
            onUserUpdated={handleUserUpdated}
        />
      )}
    </>
  );
}

    