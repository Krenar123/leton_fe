// src/hooks/queries/itemLines.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchItemLines,
  createItemLine,
  updateItemLine,
  deleteItemLine,
  completeItemLine,
} from "@/services/api";

// Fetch item lines
export function useGetItemLines(projectRef: string) {
  return useQuery({
    queryKey: ["item_lines", projectRef],
    queryFn: () => fetchItemLines(projectRef).then(res => {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res.item_lines)) return res.item_lines;
      if (Array.isArray(res.data)) return res.data;
      console.error("Unexpected structure:", res);
      return [];
    }),
    enabled: !!projectRef,
  });
}

// Create item line
export function useCreateItemLine(projectRef: string, options?: any) {
  return useMutation({
    mutationFn: (data: any) => createItemLine(projectRef, data),
    ...options,
  });
}

// Update item line
export function useUpdateItemLine(projectRef: string, options?: any) {
  return useMutation({
    mutationFn: ({ ref, data }: { ref: string; data: any }) =>
      updateItemLine(projectRef, ref, data),
    ...options,
  });
}

// Delete item line
export function useDeleteItemLine(projectRef: string, options?: any) {
  return useMutation({
    mutationFn: (ref: string) => deleteItemLine(projectRef, ref),
    ...options,
  });
}

// Complete item line
export function useCompleteItemLine(projectRef: string, options?: any) {
  return useMutation({
    mutationFn: (ref: string) => completeItemLine(projectRef, ref),
    ...options,
  });
}
