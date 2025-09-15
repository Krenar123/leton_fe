import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjectContacts,
  createProjectContact,
  updateProjectContact,
  deleteProjectContact,
} from "@/services/api";

export interface ProjectContact {
  id: string;
  ref: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  company?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  is_new?: boolean;
}

export const useProjectContacts = (projectRef: string) => {
  const qc = useQueryClient();
  const qKey = ["projectContacts", projectRef];

  const contactsQ = useQuery({
    queryKey: qKey,
    queryFn: () => fetchProjectContacts(projectRef),
    enabled: !!projectRef,
    select: (resp) => {
      const arr = Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp) ? resp : []);
      
      return arr.map((e: any): ProjectContact => {
        const a = e.attributes ?? e;

        return {
          id: e.id ?? a.ref ?? a.id ?? "",
          ref: e.ref ?? a.ref ?? e.id ?? "",
          name: a.name ?? "Unnamed Contact",
          email: a.email ?? "",
          phone: a.phone ?? "",
          role: a.role ?? "",
          company: a.company ?? "",
          notes: a.notes ?? "",
          created_at: a.created_at ?? a.createdAt ?? "",
          updated_at: a.updated_at ?? a.updatedAt ?? "",
          is_new: a.is_new ?? a.isNew ?? false,
        };
      });
    },
  });

  const createM = useMutation({
    mutationFn: (payload: any) => createProjectContact(projectRef, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qKey }),
  });

  const updateM = useMutation({
    mutationFn: ({ contactRef, payload }: { contactRef: string; payload: any }) =>
      updateProjectContact(projectRef, contactRef, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qKey }),
  });

  const deleteM = useMutation({
    mutationFn: (contactRef: string) => deleteProjectContact(projectRef, contactRef),
    onSuccess: () => qc.invalidateQueries({ queryKey: qKey }),
  });

  return {
    contacts: contactsQ.data ?? [],
    isLoading: contactsQ.isLoading,
    isError: contactsQ.isError,
    error: contactsQ.error,
    createContact: createM.mutate,
    updateContact: updateM.mutate,
    deleteContact: deleteM.mutate,
    isCreating: createM.isPending,
    isUpdating: updateM.isPending,
    isDeleting: deleteM.isPending,
  };
};
