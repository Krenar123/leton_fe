import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { EstimateActualItem } from "@/types/financials";

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (payload: {
    item_line_ids: number[];
    amount: number;
    invoiceNumber: string;
  }) => void;
  estimatesActualsData: EstimateActualItem[];
}

export const CreateInvoiceDialog = ({
  isOpen,
  onClose,
  onCreateInvoice,
  estimatesActualsData,
}: CreateInvoiceDialogProps) => {
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>(() => generateInvoiceNumber());

  function generateInvoiceNumber() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `INV-${yyyy}-${mm}-${dd}-${rand}`;
  }

  const canSave = selectedLines.length > 0 && Number(amount) > 0;

  const itemLineOptions = useMemo(
    () =>
      estimatesActualsData
        .filter((i) => !i.isCategory)
        .map((i) => ({ value: String(i.id), label: i.itemLine, costCode: i.costCode || "-" })),
    [estimatesActualsData]
  );

  const toggleLine = (id: string) => {
    setSelectedLines((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSave = () => {
    if (!canSave) return;
    onCreateInvoice({
      item_line_ids: selectedLines.map((id) => Number(id)),
      amount: Number(amount),
      invoiceNumber,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Item Lines</Label>
            <div className="max-h-52 overflow-y-auto space-y-2 border rounded p-2">
              {itemLineOptions.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedLines.includes(opt.value)}
                    onCheckedChange={() => toggleLine(opt.value)}
                  />
                  <span>{opt.costCode} — {opt.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Select one or more item lines to include in this invoice.</p>
          </div>

          <div className="space-y-2">
            <Label>Total Amount *</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <p className="text-xs text-muted-foreground">
              This total will be split evenly across the selected item lines on the backend.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Invoice Number</Label>
            <Input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated as INV-yyyy-mm-dd-xxxxx, but you can edit.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!canSave}>Create Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
