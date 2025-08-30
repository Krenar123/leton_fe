// src/components/projects/financials/CreateBillDialog.tsx
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EstimateActualItem } from "@/types/financials";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreateBill: (selected: {
    costCode: string;
    itemLine: string;
    amount: number;
    billNumber?: string;     // <- pass invoice number too
  }[]) => void;
  estimatesActualsData: EstimateActualItem[];
}

export const CreateBillDialog = ({ isOpen, onClose, onCreateBill, estimatesActualsData }: Props) => {
  const [supplierId, setSupplierId] = useState<string>("");
  const [itemLine, setItemLine] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [billNumber, setBillNumber] = useState<string>(() => generateBillNumber());

  // generate bill number: INV-{5 digit random}
  function generateBillNumber() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(10000 + Math.random() * 90000); // 5 digits
    return `BILL-${yyyy}-${mm}-${dd}-${rand}`;
  }

  const canSave = Number(amount) > 0;

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

    onCreateBill([
      {
        costCode: selected.costCode,
        itemLine: selected.value,
        amount: Number(amount),
        billNumber, // pass number
      },
    ]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create Bill</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Item Line</Label>
            <Select value={itemLine} onValueChange={setItemLine}>
              <SelectTrigger><SelectValue placeholder="Select item line" /></SelectTrigger>
              <SelectContent>
                {itemLineOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.costCode} - {opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Bill Number</Label>
            <Input value={billNumber} onChange={e => setBillNumber(e.target.value)}
                   placeholder="auto if left blank"/>
          </div>
          <div>
            <Label>Amount *</Label>
            <Input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
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
