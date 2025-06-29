
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Quote } from "@/lib/data";
import { MoreVertical, Trash2, Download, CheckCircle, XCircle, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type QuoteCardProps = {
  quote: Quote;
  onDelete: (quoteId: string) => void;
};

const statusConfig = {
    Draft: { variant: "outline", icon: Clock, label: "Draft" },
    Sent: { variant: "secondary", icon: Clock, label: "Sent" },
    Accepted: { variant: "default", icon: CheckCircle, label: "Accepted" },
    Rejected: { variant: "destructive", icon: XCircle, label: "Rejected" },
} as const;


export function QuoteCard({ quote, onDelete }: QuoteCardProps) {
    const {variant, icon: Icon, label} = statusConfig[quote.status];

    const getDiscountDisplay = () => {
        if (!quote.discount) return null;
        return quote.discount.type === 'fixed' 
            ? `$${quote.discount.value.toLocaleString()}` 
            : `${quote.discount.value}%`;
    };

    const getFinalValue = () => {
        if (!quote.discount) {
            return quote.value;
        }
        if (quote.discount.type === 'fixed') {
            return quote.value - quote.discount.value;
        }
        // Percentage
        return quote.value * (1 - (quote.discount.value / 100));
    };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between p-4">
        <div>
          <CardTitle className="text-base font-bold">{quote.quoteNumber}</CardTitle>
          <CardDescription className="text-xs">
             {quote.discount ? (
                <span>
                    Value: <span className="line-through">${quote.value.toLocaleString()}</span> &rarr; ${getFinalValue().toLocaleString()}
                </span>
            ) : (
                <span>Value: ${quote.value.toLocaleString()}</span>
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
         {quote.discount && (
            <div className="flex justify-between">
                <span className="text-muted-foreground">Discount Applied</span>
                <span className="font-medium text-destructive">{getDiscountDisplay()}</span>
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
        {quote.documentName && (
             <div className="flex justify-between items-center pt-2">
                <span className="text-muted-foreground">Attachment</span>
                <Button variant="link" size="sm" className="p-0 h-auto">{quote.documentName}</Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
