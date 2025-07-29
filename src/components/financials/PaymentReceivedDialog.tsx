
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FinancialDocument } from "@/types/financials";

interface PaymentReceivedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: (invoiceId: string, amount: number, paymentDate: string) => void;
  invoices: FinancialDocument[];
}

export const PaymentReceivedDialog = ({
  isOpen,
  onClose,
  onPayment,
  invoices,
}: PaymentReceivedDialogProps) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState("");

  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId);

  const handleInvoiceSelect = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setPaymentAmount(invoice.amount);
    }
  };

  const handleSubmit = () => {
    if (!selectedInvoiceId || !paymentAmount || !paymentDate) return;
    
    onPayment(selectedInvoiceId, paymentAmount, paymentDate);
    
    // Reset form
    setSelectedInvoiceId("");
    setPaymentAmount(0);
    setPaymentDate("");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Payment Received</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Selection */}
          <div className="space-y-2">
            <Label htmlFor="invoice-select">Select Invoice</Label>
            <Select value={selectedInvoiceId} onValueChange={handleInvoiceSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an invoice to mark as paid" />
              </SelectTrigger>
              <SelectContent>
                {invoices.map((invoice) => (
                  <SelectItem key={invoice.id} value={invoice.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{invoice.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className="text-xs">
                          {invoice.itemLine}
                        </Badge>
                        <span className="font-medium">
                          {formatCurrency(invoice.amount)}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Details */}
          {selectedInvoice && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="text-sm font-medium">Invoice Details</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Item Line:</span>
                  <div>{selectedInvoice.itemLine}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Invoice Amount:</span>
                  <div className="font-medium">{formatCurrency(selectedInvoice.amount)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Invoice Date:</span>
                  <div>{format(new Date(selectedInvoice.uploadDate), 'dd/MM/yyyy')}</div>
                </div>
                {selectedInvoice.expectedDate && (
                  <div>
                    <span className="text-muted-foreground">Due Date:</span>
                    <div>{format(new Date(selectedInvoice.expectedDate), 'dd/MM/yyyy')}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Payment Amount</Label>
            <Input
              id="payment-amount"
              type="number"
              placeholder="Enter payment amount"
              value={paymentAmount || ""}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
            />
            {selectedInvoice && paymentAmount !== selectedInvoice.amount && (
              <div className="text-sm text-muted-foreground">
                {paymentAmount > selectedInvoice.amount 
                  ? "⚠️ Payment amount exceeds invoice amount"
                  : paymentAmount < selectedInvoice.amount
                  ? "ℹ️ Partial payment"
                  : ""
                }
              </div>
            )}
          </div>

          {/* Payment Date */}
          <div className="space-y-2">
            <Label htmlFor="payment-date">Payment Date</Label>
            <Input
              id="payment-date"
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          {/* Payment Summary */}
          {paymentAmount > 0 && (
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Payment Summary</div>
              <div className="text-xl font-bold text-primary">
                {formatCurrency(paymentAmount)}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedInvoiceId || !paymentAmount || !paymentDate}
            >
              Record Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
