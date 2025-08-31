import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { EstimateActualItem } from "@/types/financials";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateBill: (payload: {
    item_line_ids: number[];
    amount: number;
    billNumber: string;
  }) => void;
  estimatesActualsData: EstimateActualItem[];
}

export const CreateBillDialog = ({ isOpen, onClose, onCreateBill, estimatesActualsData }: Props) => {
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [billNumber, setBillNumber] = useState<string>(() => generateBillNumber());

  function generateBillNumber() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `BILL-${yyyy}-${mm}-${dd}-${rand}`;
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
    onCreateBill({
      item_line_ids: selectedLines.map((id) => Number(id)),
      amount: Number(amount),
      billNumber,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Bill</DialogTitle></DialogHeader>

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
            <p className="text-xs text-muted-foreground">Select one or more item lines to include in this bill.</p>
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
            <Label>Bill Number</Label>
            <Input
              type="text"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="auto if left blank"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!canSave}>Create Bill</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
