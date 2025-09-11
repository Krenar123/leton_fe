
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Backstop } from "./types";
import { fetchProjectBackstops, deleteBackstop as deleteBackstopApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export const useBackstopsData = (projectRef: string) => {
  const { toast } = useToast();

  const { data: backstopsData, isLoading, refetch } = useQuery({
    queryKey: ["backstops", projectRef],
    queryFn: () => fetchProjectBackstops(projectRef),
    enabled: !!projectRef,
  });

  const backstops: Backstop[] = backstopsData?.data?.map((entry: any) => ({
    id: entry.id,
    what: getBackstopWhat(entry.attributes),
    where: getBackstopWhere(entry.attributes),
    backstopValue: formatBackstopValue(entry.attributes),
    status: entry.attributes.is_reached ? "Reached" : "Monitoring",
    currentValue: entry.attributes.current_value,
    type: mapBackstopType(entry.attributes.scope_type, entry.attributes.threshold_type),
    isReached: entry.attributes.is_reached,
    severity: entry.attributes.severity || "medium",
    dateCreated: entry.attributes.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    isAutomatic: entry.attributes.is_automatic || false,
  })) || [];

  const handleDeleteBackstop = async (id: number) => {
    const backstop = backstops.find(b => b.id === id);
    if (backstop?.isAutomatic) {
      toast({
        title: "Cannot Delete",
        description: "Automatic backstops cannot be deleted",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteBackstopApi(projectRef, id.toString());
      toast({
        title: "Success",
        description: "Backstop deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete backstop",
        variant: "destructive",
      });
    }
  };

  const totalBackstops = backstops.length;
  const reachedBackstops = backstops.filter(b => b.isReached).length;

  return {
    backstops,
    totalBackstops,
    reachedBackstops,
    handleDeleteBackstop,
    refetchBackstops: refetch,
    isLoading,
  };
};

// Helper functions to format backstop data from API
function getBackstopWhat(attributes: any): string {
  if (attributes.scope_type === "item_line") return "Item Line Amount";
  if (attributes.scope_type === "objective") return "Objective Due Date";
  if (attributes.scope_type === "task") return "Task Due Date";
  if (attributes.scope_type === "project_profit") return "Project Profitability";
  if (attributes.scope_type === "projected_cashflow") return "Projected Cash Flow";
  return "Backstop";
}

function getBackstopWhere(attributes: any): string {
  return attributes.scope_name || attributes.scope_ref || "Unknown Scope";
}

function formatBackstopValue(attributes: any): string {
  if (attributes.threshold_type === "amount") {
    return `$${(attributes.threshold_value_cents / 100).toLocaleString()}`;
  } else if (attributes.threshold_type === "date") {
    return attributes.threshold_date;
  } else if (attributes.threshold_type === "percentage") {
    return `${attributes.threshold_value}%`;
  }
  return "Unknown";
}

function mapBackstopType(scopeType: string, thresholdType: string): Backstop["type"] {
  if (scopeType === "item_line") return "item_expense";
  if (scopeType === "objective") return "task_due";
  if (scopeType === "task") return "task_due";
  if (scopeType === "project_profit") return "job_profitability";
  if (scopeType === "projected_cashflow") return "cashflow";
  return "individual";
}
