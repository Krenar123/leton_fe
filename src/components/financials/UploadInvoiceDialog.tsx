
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Plus, Trash2 } from "lucide-react";

interface UploadInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, itemLines: string[], amounts: number[], invoiceDate: string, dueDate: string) => void;
  itemLines: string[];
}

interface InvoiceLineItem {
  id: string;
  itemLine: string;
  amount: number;
}

export const UploadInvoiceDialog = ({
  isOpen,
  onClose,
  onUpload,
  itemLines,
}: UploadInvoiceDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: "1", itemLine: "", amount: 0 }
  ]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAddLineItem = () => {
    const newId = (lineItems.length + 1).toString();
    setLineItems([...lineItems, { id: newId, itemLine: "", amount: 0 }]);
  };

  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const handleLineItemChange = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const getTotalAmount = () => {
    return lineItems.reduce((total, item) => total + item.amount, 0);
  };

  const handleSubmit = () => {
    if (!file || !invoiceDate || !dueDate) return;
    
    const validLineItems = lineItems.filter(item => item.itemLine && item.amount > 0);
    if (validLineItems.length === 0) return;

    const itemLineNames = validLineItems.map(item => item.itemLine);
    const amounts = validLineItems.map(item => item.amount);

    onUpload(file, itemLineNames, amounts, invoiceDate, dueDate);
    
    // Reset form
    setFile(null);
    setInvoiceDate("");
    setDueDate("");
    setLineItems([{ id: "1", itemLine: "", amount: 0 }]);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Amount Display */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Invoice Amount</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(getTotalAmount())}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="invoice-file">Invoice File</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                id="invoice-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="invoice-file"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {file ? file.name : "Click to upload invoice file"}
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF, JPG, JPEG, PNG accepted
                </span>
              </label>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Invoice Line Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLineItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Line
              </Button>
            </div>

            {lineItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <Select
                    value={item.itemLine}
                    onValueChange={(value) => handleLineItemChange(item.id, 'itemLine', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select item line" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemLines.map((itemLine) => (
                        <SelectItem key={itemLine} value={itemLine}>
                          {itemLine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={item.amount || ""}
                    onChange={(e) => handleLineItemChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveLineItem(item.id)}
                  disabled={lineItems.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-date">Invoice Date</Label>
              <Input
                id="invoice-date"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!file || !invoiceDate || !dueDate || getTotalAmount() === 0}
            >
              Upload Invoice
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
