// src/components/projects/financials/CreateInvoiceDialog.tsx
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EstimateActualItem } from "@/types/financials";

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (selected: {
    costCode: string;
    itemLine: string;
    amount: number;
    invoiceNumber?: string;     // <- pass invoice number too
  }[]) => void;
  estimatesActualsData: EstimateActualItem[];
}

export const CreateInvoiceDialog = ({
  isOpen,
  onClose,
  onCreateInvoice,
  estimatesActualsData,
}: CreateInvoiceDialogProps) => {
  const [itemLine, setItemLine] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>(() => generateInvoiceNumber());

  // generate invoice number: INV-{5 digit random}
  function generateInvoiceNumber() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(10000 + Math.random() * 90000); // 5 digits
    return `INV-${yyyy}-${mm}-${dd}-${rand}`;
  }
  

  const canSave = itemLine && Number(amount) > 0;

  const itemLineOptions = useMemo(
    () =>
      estimatesActualsData
        .filter((i) => !i.isCategory)
        .map((i) => ({ value: i.itemLine, label: i.itemLine, costCode: i.costCode || "-" })),
    [estimatesActualsData]
  );

  const handleSave = () => {
    if (!canSave) return;
    const selected = itemLineOptions.find((o) => o.value === itemLine);
    if (!selected) return;

    onCreateInvoice([
      {
        costCode: selected.costCode,
        itemLine: selected.value,
        amount: Number(amount),
        invoiceNumber, // pass number
      },
    ]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Item Line</Label>
            <Select value={itemLine} onValueChange={setItemLine}>
              <SelectTrigger>
                <SelectValue placeholder="Select item line" />
              </SelectTrigger>
              <SelectContent>
                {itemLineOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.costCode} - {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount *</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Invoice Number</Label>
            <Input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated as INV-year-month-day-xxxxx, but you can edit.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
