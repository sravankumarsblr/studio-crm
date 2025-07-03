
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddContractForm, type AddContractFormValues } from "./add-contract-form";
import type { Opportunity, Contract } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type AddContractDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  opportunity: Opportunity;
  onContractAdded: (newContract: Contract) => void;
};

export function AddContractDialog({ 
    isOpen, 
    setIsOpen, 
    opportunity, 
    onContractAdded,
}: AddContractDialogProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleSave = (data: AddContractFormValues) => {
    // In a real app, this would trigger a server action
    const acceptedQuote = opportunity.quotes.find(q => q.status === 'Accepted');
    
    const newContract: Contract = {
        id: `CT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`,
        opportunityId: opportunity.id,
        poNumber: acceptedQuote?.poNumber || 'N/A',
        value: opportunity.value,
        companyName: opportunity.companyName,
        lineItems: opportunity.lineItems,
        milestones: [],
        documentName: data.document?.name,
        ...data,
    };

    onContractAdded(newContract);
    
    toast({
      title: "Contract Created",
      description: `The contract "${data.contractTitle}" has been successfully created.`,
    });
    setIsOpen(false);
    router.push(`/contracts/${newContract.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
          <DialogDescription>
            Create a new contract from opportunity: "{opportunity.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
          <AddContractForm 
            opportunity={opportunity}
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
