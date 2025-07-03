
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EditContractForm, type EditContractFormValues } from "./edit-contract-form";
import type { Contract } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

type EditContractDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  contract: Contract;
  onContractUpdated: (updatedData: Partial<Contract>) => void;
};

export function EditContractDialog({ isOpen, setIsOpen, contract, onContractUpdated }: EditContractDialogProps) {
  const { toast } = useToast();

  const handleSave = (data: EditContractFormValues) => {
    const updatedData: Partial<Contract> = {
      ...data,
      documentName: data.document ? data.document.name : contract.documentName,
    };
    onContractUpdated(updatedData);
    
    toast({
      title: "Contract Updated",
      description: `The contract "${data.contractTitle}" has been successfully updated.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Contract</DialogTitle>
          <DialogDescription>
            Update the details for contract: "{contract.contractTitle}".
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto -mr-6 pr-6 py-4">
          <EditContractForm 
            contract={contract}
            onSave={handleSave} 
            onCancel={() => setIsOpen(false)} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
