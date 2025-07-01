
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Opportunity, Quote, QuoteLineItem } from "@/lib/data";
import { MoreVertical, Trash2, Download, CheckCircle, XCircle, Clock, FileCheck2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type QuoteCardProps = {
  quote: Quote;
  opportunityStage: Opportunity['stage'];
  onDelete: (quoteId: string) => void;
  onAttachPo: (quote: Quote) => void;
};

const statusConfig = {
    Draft: { variant: "outline", icon: Clock, label: "Draft" },
    Sent: { variant: "secondary", icon: Clock, label: "Sent" },
    Accepted: { variant: "default", icon: CheckCircle, label: "Accepted" },
    Rejected: { variant: "destructive", icon: XCircle, label: "Rejected" },
} as const;


export function QuoteCard({ quote, opportunityStage, onDelete, onAttachPo }: QuoteCardProps) {
    const {variant, icon: Icon, label} = statusConfig[quote.status];

    const calculateTotals = (lineItems: QuoteLineItem[]) => {
      return lineItems.reduce((acc, item) => {
          const lineTotal = item.unitPrice * item.quantity;
          let discountAmount = 0;
          if (item.discount) {
              if (item.discount.type === 'percentage') {
                  discountAmount = lineTotal * (item.discount.value / 100);
              } else { // fixed
                  discountAmount = item.discount.value;
              }
          }
          acc.subtotal += lineTotal;
          acc.discount += discountAmount;
          acc.grandTotal += (lineTotal - discountAmount);
          return acc;
      }, { subtotal: 0, discount: 0, grandTotal: 0 });
    };

    const totals = calculateTotals(quote.lineItems);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between p-4">
        <div>
          <CardTitle className="text-base font-bold">{quote.quoteNumber}</CardTitle>
          <CardDescription className="text-xs">
             {totals.discount > 0 ? (
                <span>
                    Value: <span className="line-through">₹{totals.subtotal.toLocaleString('en-IN')}</span> &rarr; ₹{totals.grandTotal.toLocaleString('en-IN')}
                </span>
            ) : (
                <span>Value: ₹{totals.grandTotal.toLocaleString('en-IN')}</span>
            )}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Download className="mr-2 h-4 w-4"/>Download</DropdownMenuItem>
            {opportunityStage !== 'Closed Won' && quote.status !== 'Accepted' && (
              <DropdownMenuItem onClick={() => onAttachPo(quote)}>
                <FileCheck2 className="mr-2 h-4 w-4"/>Attach PO
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(quote.id)}>
              <Trash2 className="mr-2 h-4 w-4"/>Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <Separator />
      <CardContent className="p-4 text-sm space-y-3">
        <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={variant as any}>
              <Icon className="mr-1 h-3 w-3" />
              {label}
            </Badge>
        </div>
         {totals.discount > 0 && (
            <div className="flex justify-between">
                <span className="text-muted-foreground">Discount Applied</span>
                <span className="font-medium text-destructive">₹{totals.discount.toLocaleString('en-IN')}</span>
            </div>
        )}
        <div className="flex justify-between">
            <span className="text-muted-foreground">Issue Date</span>
            <span>{quote.date}</span>
        </div>
        <div className="flex justify-between">
            <span className="text-muted-foreground">Expiry Date</span>
            <span>{quote.expiryDate}</span>
        </div>
         {quote.poNumber && (
          <div className="flex justify-between">
              <span className="text-muted-foreground">PO Number</span>
              <span className="font-medium">{quote.poNumber}</span>
          </div>
        )}
        {quote.documentName && (
             <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Quote Doc</span>
                <Button variant="link" size="sm" className="p-0 h-auto">{quote.documentName}</Button>
            </div>
        )}
        {quote.poDocumentName && (
             <div className="flex justify-between items-center">
                <span className="text-muted-foreground">PO Doc</span>
                <Button variant="link" size="sm" className="p-0 h-auto">{quote.poDocumentName}</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

    
