// src/hooks/queries/teamCosts.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTeamCosts, bulkCreateTeamCosts } from "@/services/api";

export function useGetTeamCosts(projectRef: string, params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ["team_costs", projectRef, params?.from, params?.to],
    queryFn: () => fetchTeamCosts(projectRef, params),
    select: (res) =>
      (res?.data || []).map((row: any) => ({
        id: row.id,
        ref: row.attributes?.ref,
        date: row.attributes?.work_date, // "yyyy-mm-dd"
        hoursWorked: Number(row.attributes?.hours_worked) || 0,
        hourlyRate: Number(row.attributes?.hourly_rate) || 0,
        totalCost: Number(row.attributes?.total_cost) || 0,
        description: row.attributes?.description || "",
        user: {
          ref: row.attributes?.user?.ref,
          fullName: row.attributes?.user?.full_name,
        },
      })),
  });
}

export function useCreateTeamCosts(projectRef: string, opts?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: (payload: Parameters<typeof bulkCreateTeamCosts>[1]) =>
      bulkCreateTeamCosts(projectRef, payload),
    onSuccess: () => opts?.onSuccess?.(),
  });
}
