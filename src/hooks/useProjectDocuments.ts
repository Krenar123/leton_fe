import { useState, useEffect } from "react";
import { fetchProjectDocuments, uploadProjectDocument, deleteDocument } from "@/services/api";
import { DocumentItem } from "@/components/projects/documents/types";

export const useProjectDocuments = (projectRef: string) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents when component mounts or projectRef changes
  useEffect(() => {
    if (projectRef) {
      loadDocuments();
    }
  }, [projectRef]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjectDocuments(projectRef);
      
      // Transform backend data to match frontend DocumentItem interface
      const transformedDocuments: DocumentItem[] = data.map((doc: any) => ({
        id: doc.id,
        name: doc.name || doc.filename,
        type: "file" as const,
        size: doc.size,
        createdAt: doc.created_at || doc.uploaded_at,
        updatedAt: doc.updated_at || doc.created_at || doc.uploaded_at,
        parentId: null, // For now, all documents are in root
        fileType: doc.file_type || doc.name?.split('.').pop()?.toLowerCase(),
        isNew: false,
        lastAccessedAt: doc.last_accessed_at
      }));
      
      setDocuments(transformedDocuments);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
      console.error("Error loading documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await uploadProjectDocument(projectRef, file);
      
      // Add the new document to the list
      const newDocument: DocumentItem = {
        id: response.id || Date.now(),
        name: file.name,
        type: "file",
        size: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentId: null,
        fileType: file.name.split('.').pop()?.toLowerCase(),
        isNew: true,
        lastAccessedAt: new Date().toISOString()
      };
      
      setDocuments(prev => [newDocument, ...prev]);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload document");
      console.error("Error uploading document:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Find the document to get its ref
      const document = documents.find(doc => doc.id === documentId);
      if (!document) {
        throw new Error("Document not found");
      }
      
      // Use the document ID as ref for now (backend might use different ref system)
      await deleteDocument(documentId.toString());
      
      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete document");
      console.error("Error deleting document:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshDocuments = () => {
    loadDocuments();
  };

  return {
    documents,
    loading,
    error,
    handleUpload,
    handleDelete,
    refreshDocuments
  };
};
