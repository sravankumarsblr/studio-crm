
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Milestone, Product } from "@/lib/data";
import { products as allProducts, users } from "@/lib/data";
import { MoreVertical, Edit, FilePlus, Package, CheckCircle, Clock, Circle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

type MilestoneCardProps = {
  milestone: Milestone;
  onEdit: () => void;
  onRaiseInvoice: () => void;
};

const milestoneStatusConfig = {
    'Completed': { variant: "default", icon: CheckCircle, label: "Completed", progress: 100 },
    'In Progress': { variant: "secondary", icon: Clock, label: "In Progress", progress: 50 },
    'Pending': { variant: "outline", icon: Circle, label: "Pending", progress: 0 },
} as const;

const invoiceStatusConfig = {
    'Paid': { variant: "default", label: "Paid" },
    'Invoiced': { variant: "secondary", label: "Invoiced" },
    'Partially Invoiced': { variant: "outline", label: "Partially Invoiced" },
    'Not Invoiced': { variant: "outline", label: "Not Invoiced" },
} as const;


export function MilestoneCard({ milestone, onEdit, onRaiseInvoice }: MilestoneCardProps) {
    const {variant: mVariant, icon: MIcon, label: mLabel, progress } = milestoneStatusConfig[milestone.status];
    const {variant: iVariant, label: iLabel} = invoiceStatusConfig[milestone.invoiceStatus];
    const assignee = users.find(u => u.id === milestone.assignedToId)?.name || 'N/A';
    const totalInvoiced = milestone.invoices.reduce((sum, inv) => sum + inv.amount, 0);

    const associatedProducts = milestone.productIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as Product[];

  return (
    <Card className="shadow-md">
      <CardHeader className="flex-row items-start justify-between p-4">
        <div>
          <CardTitle className="text-base font-bold">{milestone.name}</CardTitle>
          <CardDescription className="text-xs">
             Due: {milestone.dueDate}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}><Edit className="mr-2 h-4 w-4"/>Edit Milestone</DropdownMenuItem>
            <DropdownMenuItem onClick={onRaiseInvoice} disabled={milestone.invoiceStatus === 'Invoiced'}>
                <FilePlus className="mr-2 h-4 w-4"/>Raise Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 text-sm space-y-3">
        <div className="space-y-1">
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Progress</span>
                <Badge variant={mVariant as any}><MIcon className="mr-1 h-3 w-3" />{mLabel}</Badge>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Assigned To</p>
                <p className="font-medium">{assignee}</p>
            </div>
             <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="font-medium">₹{milestone.amount.toLocaleString('en-IN')}</p>
            </div>
             <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Invoice Status</p>
                <Badge variant={iVariant as any}>{iLabel}</Badge>
            </div>
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Amount Invoiced</p>
                <p className="font-medium">₹{totalInvoiced.toLocaleString('en-IN')}</p>
            </div>
        </div>
        
        {associatedProducts.length > 0 && (
            <>
                <Separator/>
                <div className="space-y-2">
                    <h4 className="font-medium text-muted-foreground flex items-center gap-2"><Package className="h-4 w-4"/>Associated Products</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {associatedProducts.map(p => (
                            <li key={p.id}>{p.name}</li>
                        ))}
                    </ul>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
