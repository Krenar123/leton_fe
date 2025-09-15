import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjectNotes,
  createProjectNote,
  updateProjectNote,
  deleteProjectNote,
} from "@/services/api";

export interface ProjectNote {
  id: string;
  ref: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id?: string;
  is_new?: boolean;
}

export const useProjectNotes = (projectRef: string) => {
  const qc = useQueryClient();
  const qKey = ["projectNotes", projectRef];

  const notesQ = useQuery({
    queryKey: qKey,
    queryFn: () => fetchProjectNotes(projectRef),
    enabled: !!projectRef,
    select: (resp) => {
      const arr = Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp) ? resp : []);
      
      return arr.map((e: any): ProjectNote => {
        const a = e.attributes ?? e;

        return {
          id: e.id ?? a.ref ?? a.id ?? "",
          ref: e.ref ?? a.ref ?? e.id ?? "",
          title: a.title ?? "Untitled Note",
          content: a.content ?? "",
          created_at: a.created_at ?? a.createdAt ?? "",
          updated_at: a.updated_at ?? a.updatedAt ?? "",
          author_id: a.author_id ?? a.authorId ?? "",
          is_new: a.is_new ?? a.isNew ?? false,
        };
      });
    },
  });

  const createM = useMutation({
    mutationFn: (payload: any) => createProjectNote(projectRef, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qKey }),
  });

  const updateM = useMutation({
    mutationFn: ({ noteRef, payload }: { noteRef: string; payload: any }) =>
      updateProjectNote(projectRef, noteRef, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qKey }),
  });

  const deleteM = useMutation({
    mutationFn: (noteRef: string) => deleteProjectNote(projectRef, noteRef),
    onSuccess: () => qc.invalidateQueries({ queryKey: qKey }),
  });

  return {
    notes: notesQ.data ?? [],
    isLoading: notesQ.isLoading,
    isError: notesQ.isError,
    error: notesQ.error,
    createNote: createM.mutate,
    updateNote: updateM.mutate,
    deleteNote: deleteM.mutate,
    isCreating: createM.isPending,
    isUpdating: updateM.isPending,
    isDeleting: deleteM.isPending,
  };
};
