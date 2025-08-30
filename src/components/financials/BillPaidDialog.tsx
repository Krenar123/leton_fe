// src/components/projects/financials/BillPaidDialog.tsx
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type LoadedBill = {
  id: string | number;
  ref: string;
  bill_number?: string | null;
  amount?: number | string | null;
  total_amount?: number | string | null;
  outstanding?: number | string | null; // ← allow BE to provide this if available
  item_line_id?: number | null;
};

interface BillPaidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectRef: string;
  loadBills: (projectRef: string) => Promise<LoadedBill[]>;
  onPayment: (billRef: string, amount: number, paymentDate: string) => void;
  /** Optional: filter by item_line_id when you opened from a specific row */
  itemLineIdFilter?: number;
}

const toYMD = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const toNum = (v: unknown): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export const BillPaidDialog = ({
  isOpen,
  onClose,
  projectRef,
  loadBills,
  onPayment,
  itemLineIdFilter,
}: BillPaidDialogProps) => {
  const [bills, setBills] = useState<LoadedBill[]>([]);
  const [billRef, setbillRef] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");

  // Load bills when opening; preselect first (optionally filtered) and set defaults
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const list = await loadBills(projectRef);
      setBills(list);

      // default payment date = today
      setPaymentDate(toYMD(new Date()));

      const filtered = itemLineIdFilter
        ? list.filter(i => Number(i.item_line_id) === Number(itemLineIdFilter))
        : list;

      if (filtered.length) {
        const first = filtered[0];
        console.log(first.ref);
        console.log(String(first.ref));
        setbillRef(String(first.ref));

        const pref =
          toNum(first.outstanding) ??
          toNum(first.total_amount) ??
          toNum(first.amount) ??
          0;

        setAmount(pref ? String(pref) : "");
      } else {
        setbillRef("");
        setAmount("");
      }
    })();
  }, [isOpen, projectRef, loadBills, itemLineIdFilter]);

  // When the selected bill changes, refresh the suggested amount
  useEffect(() => {
    if (!billRef) return;
    const inv = bills.find(i => i.ref === billRef);
    if (!inv) return;

    const pref =
      toNum(inv.outstanding) ??
      toNum(inv.total_amount) ??
      toNum(inv.amount) ??
      0;

    setAmount(pref ? String(pref) : "");
  }, [billRef, bills]);

  const canSave = !!billRef && Number(amount) > 0 && !!paymentDate;

  console.log(bills);
  const options = useMemo(() => {
    return bills.map(i => {
      const labelNumber = i.bill_number || i.ref;
      const out = toNum(i.outstanding);
      const suffix = typeof out === "number" ? ` — outstanding: ${out.toLocaleString()}` : "";
      return {
        value: String(i.ref),
        label: `${labelNumber}${suffix}`,
      };
    });
  }, [bills]);

  console.log("options");
  console.log(options);

  const handleSave = () => {
    if (!canSave) return;
    onPayment(billRef, Number(amount), paymentDate);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Received</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Bill</Label>
            <Select value={billRef} onValueChange={setbillRef}>
              <SelectTrigger>
                <SelectValue placeholder="Select bill" />
              </SelectTrigger>
              <SelectContent>
                {options.map(o => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
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
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label>Payment Date *</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!canSave}>Record Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
