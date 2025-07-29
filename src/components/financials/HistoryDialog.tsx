
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Trash2, Edit2, FileText, Search } from "lucide-react";
import { FinancialDocument } from "@/types/financials";

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemLine: string;
  documents: FinancialDocument[];
  onDeleteDocument: (documentId: string) => void;
  onRenameDocument: (documentId: string, newName: string) => void;
}

export const HistoryDialog = ({ 
  isOpen, 
  onClose, 
  itemLine, 
  documents,
  onDeleteDocument,
  onRenameDocument
}: HistoryDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRename = (docId: string) => {
    if (newName.trim()) {
      onRenameDocument(docId, newName.trim());
      setEditingDoc(null);
      setNewName("");
    }
  };

  const handleDelete = (docId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      onDeleteDocument(docId);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice':
        return 'bg-blue-100 text-blue-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'bill':
        return 'bg-orange-100 text-orange-800';
      case 'receipt':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Document History - {itemLine}</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        {editingDoc === doc.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="h-8"
                              onKeyPress={(e) => e.key === 'Enter' && handleRename(doc.id)}
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleRename(doc.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {setEditingDoc(null); setNewName("");}}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <span>{doc.name}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(doc.type)}`}>
                        {doc.type}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${doc.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Download functionality would go here
                            console.log('Download:', doc.name);
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingDoc(doc.id);
                            setNewName(doc.name);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
