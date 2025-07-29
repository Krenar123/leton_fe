
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EstimateActualItem } from "@/types/financials";

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (selectedItems: { costCode: string; itemLine: string; amount: number }[]) => void;
  estimatesActualsData: EstimateActualItem[];
}

export const CreateInvoiceDialog = ({
  isOpen,
  onClose,
  onCreateInvoice,
  estimatesActualsData,
}: CreateInvoiceDialogProps) => {
  const [selectedItems, setSelectedItems] = useState<{ costCode: string; itemLine: string; amount: number }[]>([]);

  // Filter to only show vendor items (level 4) that have cost codes
  const availableItems = estimatesActualsData.filter(
    item => item.level === 4 && item.costCode && !item.isCategory
  );

  const handleItemToggle = (item: EstimateActualItem, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, {
        costCode: item.costCode!,
        itemLine: item.itemLine,
        amount: 0
      }]);
    } else {
      setSelectedItems(prev => prev.filter(selected => selected.costCode !== item.costCode));
    }
  };

  const handleAmountChange = (costCode: string, amount: number) => {
    setSelectedItems(prev => prev.map(item => 
      item.costCode === costCode ? { ...item, amount } : item
    ));
  };

  const totalInvoiceAmount = selectedItems.reduce((sum, item) => sum + item.amount, 0);

  const handleCreateInvoice = () => {
    if (selectedItems.length > 0 && selectedItems.every(item => item.amount > 0)) {
      onCreateInvoice(selectedItems);
      setSelectedItems([]);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedItems([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Select the cost codes you want to include in this invoice and specify the amount for each.
          </div>

          <div className="space-y-3">
            {availableItems.map((item) => {
              const isSelected = selectedItems.some(selected => selected.costCode === item.costCode);
              const selectedItem = selectedItems.find(selected => selected.costCode === item.costCode);

              return (
                <div key={item.costCode} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleItemToggle(item, checked as boolean)}
                  />
                  
                  <div className="flex-1">
                    <div className="font-medium">{item.itemLine}</div>
                    <div className="text-sm text-muted-foreground">
                      Cost Code: {item.costCode} • Vendor: {item.vendor || 'N/A'}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`amount-${item.costCode}`} className="text-sm">
                        Amount:
                      </Label>
                      <Input
                        id={`amount-${item.costCode}`}
                        type="number"
                        placeholder="0.00"
                        className="w-24"
                        value={selectedItem?.amount || ''}
                        onChange={(e) => handleAmountChange(item.costCode!, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedItems.length > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="font-medium">Invoice Summary</div>
              <div className="text-sm text-muted-foreground mt-1">
                {selectedItems.length} item(s) selected
              </div>
              <div className="text-xl font-semibold mt-2">
                Total: ${totalInvoiceAmount.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateInvoice}
            disabled={selectedItems.length === 0 || !selectedItems.every(item => item.amount > 0)}
            className="bg-[#0a1f44] hover:bg-[#081a3a] text-white"
          >
            Create Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
