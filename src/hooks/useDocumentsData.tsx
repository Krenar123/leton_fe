
import { useState } from "react";
import { FinancialDocument } from "@/types/financials";

export const useDocumentsData = () => {
  const [documents, setDocuments] = useState<FinancialDocument[]>([
    {
      id: "1",
      name: "Foundation Invoice #001.pdf",
      type: "invoice",
      uploadDate: "2025-07-15",
      amount: 5500,
      itemLine: "Foundation Work",
      expectedDate: "2025-08-15"
    },
    {
      id: "2",
      name: "Electrical Payment Receipt.pdf",
      type: "payment",
      uploadDate: "2025-07-20",
      amount: 1500,
      itemLine: "Electrical Installation",
      expectedDate: "2025-07-20"
    },
    {
      id: "3",
      name: "Foundation Bill #001.pdf",
      type: "bill",
      uploadDate: "2025-07-25",
      amount: 7200,
      itemLine: "Foundation Work",
      expectedDate: "2025-09-15"
    },
    {
      id: "4",
      name: "Plumbing Invoice #002.pdf",
      type: "invoice",
      uploadDate: "2025-08-01",
      amount: 2200,
      itemLine: "Plumbing",
      expectedDate: "2025-09-01"
    },
    {
      id: "5",
      name: "Electrical Bill #001.pdf",
      type: "bill",
      uploadDate: "2025-08-10",
      amount: 4200,
      itemLine: "Electrical Installation",
      expectedDate: "2025-10-16"
    }
  ]);

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleRenameDocument = (documentId: string, newName: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, name: newName } : doc
    ));
  };

  const getDocumentsForItemLine = (itemLine: string) => {
    return documents.filter(doc => doc.itemLine === itemLine);
  };

  const addDocument = (newDoc: FinancialDocument) => {
    setDocuments(prev => [...prev, newDoc]);
  };

  return {
    documents,
    handleDeleteDocument,
    handleRenameDocument,
    getDocumentsForItemLine,
    addDocument,
  };
};
