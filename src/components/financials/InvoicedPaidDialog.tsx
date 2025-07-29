
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface InvoicePaymentData {
  itemLine: string;
  invoiced: number;
  paid: number;
}

interface InvoicedPaidDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvoicePaymentData[];
  onUpdateInvoicePayment: (itemLine: string, field: 'invoiced' | 'paid', value: number) => void;
}

export const InvoicedPaidDialog = ({ isOpen, onClose, data, onUpdateInvoicePayment }: InvoicedPaidDialogProps) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'invoiced' | 'paid' | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleEdit = (itemLine: string, field: 'invoiced' | 'paid', currentValue: number) => {
    setEditingItem(itemLine);
    setEditingField(field);
    setEditValue(currentValue.toString());
  };

  const handleSave = () => {
    setShowConfirmDialog(true);
  };

  const confirmSave = () => {
    if (editingItem && editingField) {
      onUpdateInvoicePayment(editingItem, editingField, parseFloat(editValue));
    }
    setShowConfirmDialog(false);
    setEditingItem(null);
    setEditingField(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditingField(null);
    setEditValue("");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoiced vs Paid</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Item Line</th>
                  <th className="text-right py-3 px-4">Invoiced</th>
                  <th className="text-right py-3 px-4">Paid</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.itemLine} className="border-b">
                    <td className="py-3 px-4 font-medium">{item.itemLine}</td>
                    <td className="py-3 px-4 text-right">
                      {editingItem === item.itemLine && editingField === 'invoiced' ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24"
                          />
                          <Button size="sm" onClick={handleSave}>Save</Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      ) : (
                        <button
                          className="hover:bg-gray-100 px-2 py-1 rounded"
                          onClick={() => handleEdit(item.itemLine, 'invoiced', item.invoiced)}
                        >
                          ${item.invoiced.toLocaleString()}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {editingItem === item.itemLine && editingField === 'paid' ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24"
                          />
                          <Button size="sm" onClick={handleSave}>Save</Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                        </div>
                      ) : (
                        <button
                          className="hover:bg-gray-100 px-2 py-1 rounded"
                          onClick={() => handleEdit(item.itemLine, 'paid', item.paid)}
                        >
                          ${item.paid.toLocaleString()}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the {editingField} value to ${editValue}? This will also update the actual cost in the Estimates vs Actuals table.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
