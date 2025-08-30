import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Kind = "invoice" | "invoice-paid" | "bill" | "bill-paid";

interface AddInvoicePaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: Kind;

  /** When type === "invoice" */
  itemLineOptions?: { value: string; label: string }[];
  defaultItemLineValue?: string;

  /** When type === "invoice-paid" */
  invoiceOptions?: { value: string; label: string }[];
  loadingInvoices?: boolean;

  /**
   * selectorValue:
   *  - "invoice" => item_line_id (string)
   *  - "invoice-paid" => invoiceRef (string)
   */
  onSave: (
    selectorValue: string,
    type: Kind,
    amount: number,
    date: string,
    file?: File
  ) => void;
}

export const AddInvoicePaymentDialog = ({
  isOpen,
  onClose,
  type,
  itemLineOptions = [],
  defaultItemLineValue = "",
  invoiceOptions = [],
  loadingInvoices = false,
  onSave,
}: AddInvoicePaymentDialogProps) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectorValue, setSelectorValue] = useState<string>(defaultItemLineValue || "");

  const isInvoice = type === "invoice";
  const isInvoicePaid = type === "invoice-paid";

  // basic validation
  const isValid = useMemo(() => {
    const moneyOk = amount && parseFloat(amount) > 0;
    const dateOk = !!date;
    const selectorOk = !!selectorValue;
    if (isInvoice || isInvoicePaid) return moneyOk && dateOk && selectorOk;
    return moneyOk && dateOk; // bill/bill-paid future
  }, [amount, date, selectorValue, isInvoice, isInvoicePaid]);

  const title = useMemo(() => {
    switch (type) {
      case "invoice": return "Add Invoice";
      case "invoice-paid": return "Payment Received";
      case "bill": return "Add Bill";
      case "bill-paid": return "Bill Paid";
      default: return "Add";
    }
  }, [type]);

  const amountLabel = isInvoice ? "Invoice Amount" : "Amount";
  const dateLabel = isInvoice ? "Issue Date (optional)" : isInvoicePaid ? "Payment Date" : "Date";

  const selectorLabel = isInvoice
    ? "Item Line"
    : isInvoicePaid
    ? "Invoice"
    : "Select";

  const handleConfirm = () => {
    if (!isValid) return;
    onSave(selectorValue, type, parseFloat(amount), date, file || undefined);
    setAmount("");
    setDate("");
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {(isInvoice || isInvoicePaid) && (
            <div className="space-y-2">
              <Label>{selectorLabel}</Label>
              <Select
                value={selectorValue}
                onValueChange={setSelectorValue}
                disabled={isInvoicePaid && loadingInvoices}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={isInvoice ? "Choose item line…" : "Choose invoice…"} />
                </SelectTrigger>
                <SelectContent>
                  {(isInvoice ? itemLineOptions : invoiceOptions).map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isInvoicePaid && loadingInvoices && (
                <p className="text-xs text-muted-foreground">Loading invoices…</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">{amountLabel}</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{dateLabel}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Attach Document (optional)</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!isValid}>
            {isInvoice ? "Create Invoice" : isInvoicePaid ? "Record Payment" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
