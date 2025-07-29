
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddInvoicePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemLine: string;
  type: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill';
  onSave: (itemLine: string, type: 'invoice' | 'bill-paid' | 'invoice-paid' | 'bill', amount: number, expectedDate: string, file?: File) => void;
}

export const AddInvoicePaymentDialog = ({ 
  isOpen, 
  onClose, 
  itemLine, 
  type, 
  onSave 
}: AddInvoicePaymentDialogProps) => {
  const [amount, setAmount] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSave = () => {
    if (!amount || parseFloat(amount) <= 0 || !expectedDate) return;
    
    const confirmed = confirm(`Are you sure you want to add this ${getDisplayName()} of $${parseFloat(amount).toLocaleString()} to ${itemLine}?`);
    if (confirmed) {
      onSave(itemLine, type, parseFloat(amount), expectedDate, file || undefined);
      setAmount("");
      setExpectedDate("");
      setFile(null);
      onClose();
    }
  };

  const getDisplayName = () => {
    switch (type) {
      case 'invoice':
        return 'invoice';
      case 'bill-paid':
        return 'bill payment';
      case 'invoice-paid':
        return 'invoice payment';
      case 'bill':
        return 'bill';
      default:
        return type;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'invoice':
        return `Add Invoice - ${itemLine}`;
      case 'bill-paid':
        return `Bill Paid - ${itemLine}`;
      case 'invoice-paid':
        return `Invoice Paid - ${itemLine}`;
      case 'bill':
        return `Add Bill - ${itemLine}`;
      default:
        return `Add ${type} - ${itemLine}`;
    }
  };

  const getDateLabel = () => {
    switch (type) {
      case 'invoice':
        return 'Expected Payment Date';
      case 'bill-paid':
        return 'Payment Date';
      case 'invoice-paid':
        return 'Payment Date';
      case 'bill':
        return 'Expected Payment Date';
      default:
        return 'Date';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter ${getDisplayName()} amount`}
            />
          </div>
          <div>
            <Label htmlFor="expectedDate">{getDateLabel()}</Label>
            <Input
              id="expectedDate"
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="file">Upload Document (Optional)</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Add {getDisplayName().charAt(0).toUpperCase() + getDisplayName().slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
