
"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deals } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const stageProgress: { [key: string]: number } = {
  'Qualification': 20,
  'Proposal': 50,
  'Negotiation': 75,
  'Closed Won': 100,
  'Closed Lost': 100,
};

const stageVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Qualification': 'outline',
  'Proposal': 'secondary',
  'Negotiation': 'default',
  'Closed Won': 'default',
  'Closed Lost': 'destructive',
};

export default function DealsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Deals" actionText="Add Deal" onActionClick={() => {}} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="bg-card rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="w-[200px]">Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.name}</TableCell>
                  <TableCell>{deal.companyName}</TableCell>
                  <TableCell>${deal.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={stageVariant[deal.stage]}>{deal.stage}</Badge>
                  </TableCell>
                  <TableCell>
                    <Progress value={stageProgress[deal.stage]} className="h-2" />
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
                           <Link href={`/deals/${deal.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Close as Won</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Close as Lost</DropdownMenuItem>
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
  );
}
