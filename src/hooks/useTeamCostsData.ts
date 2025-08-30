// src/components/projects/financials/useTeamCostsData.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchTeamCosts, bulkCreateTeamCosts, fetchUsers } from "@/services/api";

type APIRow = {
  id: string; // ref
  attributes: {
    ref: string;
    work_date: string; // yyyy-mm-dd
    hours_worked: number | string;
    hourly_rate: number | string | null;
    total_cost: number | string | null;
    description?: string | null;
  };
  relationships?: {
    user?: {
      data?: { id: string; type: string };
    };
  };
};
type APIResp = { data: APIRow[]; included?: any[] };

export function useTeamCostsData(projectRef: string) {
  const [rows, setRows] = useState<APIRow[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async (range?: { from?: string; to?: string }) => {
    setLoading(true);
    try {
      const resp: APIResp = await fetchTeamCosts(projectRef, range);
      setRows(resp.data || []);
    } finally {
      setLoading(false);
    }
  }, [projectRef]);

  const loadUsers = useCallback(async () => {
    const resp = await fetchUsers();
    // normalize JSON:API or plain list
    const items = Array.isArray(resp?.data) ? resp.data : [];
    setUsers(items.map((u: any) => ({
      ref: u.id || u.attributes?.ref,
      full_name: u.attributes?.full_name,
      wage_per_hour: u.attributes?.wage_per_hour,
    })));
  }, []);

  useEffect(() => {
    refetch();
    loadUsers();
  }, [refetch, loadUsers]);

  // FE-friendly flattened list (per-row)
  const flat = useMemo(() => {
    return rows.map(r => ({
      ref: r.attributes?.ref || r.id,
      workDate: r.attributes?.work_date,
      hoursWorked: Number(r.attributes?.hours_worked || 0),
      hourlyRate: Number(r.attributes?.hourly_rate || 0),
      totalCost: Number(r.attributes?.total_cost || 0),
      description: r.attributes?.description || "",
      // if your serializer embeds user inside attributes.user instead, adjust:
      user: r.attributes?.user || undefined,
    }));
  }, [rows]);

  // Aggregate by date for the table header rows you already render
  const groupedByDate = useMemo(() => {
    const map = new Map<string, { date: string; numberOfTeam: number; workingHours: number; totalCost: number; teamMembers: Array<{ name: string; workingHours: number; costPerHour: number }> }>();
    for (const r of flat) {
      const date = r.workDate;
      const key = date;
      const entry = map.get(key) || { date, numberOfTeam: 0, workingHours: 0, totalCost: 0, teamMembers: [] };
      const name = r.user?.full_name || "Unknown";
      entry.teamMembers.push({ name, workingHours: r.hoursWorked, costPerHour: r.hourlyRate });
      entry.numberOfTeam = entry.teamMembers.length;
      entry.workingHours += r.hoursWorked;
      entry.totalCost += r.totalCost;
      map.set(key, entry);
    }
    return Array.from(map.values()).sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [flat]);

  // Create (bulk by date)
  const createForDate = useCallback(async (work_date: string, teamMembers: Array<{ user_ref: string; workedHours: number; costPerHour?: number; description?: string }>, commonDescription?: string) => {
    const entries = teamMembers.map(m => ({
      user_ref: m.user_ref,
      hours_worked: m.workedHours,
      hourly_rate: m.costPerHour, // optional; BE will default to user.wage_per_hour if nil
      description: m.description,
    }));
    await bulkCreateTeamCosts(projectRef, { work_date, description: commonDescription, entries });
    await refetch();
  }, [projectRef, refetch]);

  return {
    loading,
    users,              // [{ref, full_name, wage_per_hour}]
    rows: flat,         // raw per-row
    groupedByDate,      // for your table
    refetch,
    createForDate,
  };
}
