
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchItemLines,
  createItemLine,
  updateItemLine,
  deleteItemLine,
  completeItemLine,
} from "@/services/api";
import { EstimateActualItem } from "@/types/financials";

export const useEstimatesActualsData = (projectRef: string) => {
  const queryClient = useQueryClient();

  // Fetch item lines
  const {
    data: itemLinesRaw = [],
    isLoading,
    refetch: refetchItemLines
  } = useQuery({
    queryKey: ["itemLines", projectRef],
    queryFn: () => fetchItemLines(projectRef).then(res => {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res.item_lines)) return res.item_lines;
      if (Array.isArray(res.data)) return res.data;
      console.error("Unexpected structure:", res);
      return [];
    })
  });

  const itemLines: EstimateActualItem[] = itemLinesRaw.data?.map((entry: any) => ({
    ...entry.attributes
  })) || [];

  // Create item line
  const createMutation = useMutation({
    mutationFn: (data: Partial<EstimateActualItem>) => createItemLine(projectRef, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["itemLines", projectRef] }),
  });

  // Update item line
  const updateMutation = useMutation({
    mutationFn: ({ ref, data }: { ref: string, data: Partial<EstimateActualItem> }) =>
      updateItemLine(projectRef, ref, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["itemLines", projectRef] }),
  });

  // Delete item line
  const deleteMutation = useMutation({
    mutationFn: (ref: string) => deleteItemLine(projectRef, ref),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["itemLines", projectRef] }),
  });

  // Toggle complete
  const completeMutation = useMutation({
    mutationFn: (ref: string) => completeItemLine(projectRef, ref),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["itemLines", projectRef] }),
  });

  const handleItemLineAction = async (ref: string, action: "edit" | "delete" | "complete") => {
    if (action === "delete") {
      await deleteMutation.mutateAsync(ref);
    } else if (action === "complete") {
      await completeMutation.mutateAsync(ref);
    } else if (action === "edit") {
      return itemLines.find(i => i.ref === ref);
    }
  };

  const handleAddItemLine = async (data: Partial<EstimateActualItem>, editingRef?: string) => {
    if (editingRef) {
      await updateMutation.mutateAsync({ ref: editingRef, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  return {
    estimatesActualsData: itemLines,
    isLoading,
    refetchItemLines,
    handleAddItemLine,
    handleItemLineAction,
  };
};
