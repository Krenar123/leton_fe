import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchClientByRef,
  fetchClientProjects,
  fetchClientInvoices,
  fetchClientMeetings,
  updateClient
} from "@/services/api";

// tiny helpers to be robust to snake/camel
const pick = (a: any, ...keys: string[]) => keys.find(k => a && k in a) ?? keys[0];
const val  = (a: any, ...keys: string[]) => a?.[pick(a, ...keys)];

export const useClientData = (clientRef: string) => {
  // --- RAW jsonapi fetches (return {data: ...}) ---
  const { data: clientRaw,    isLoading: isLoadingClient,    refetch: refetchClient,    error: clientError } = useQuery({
    queryKey: ["client", clientRef],
    queryFn: () => fetchClientByRef(clientRef),     // returns { data: {...} }
    enabled: !!clientRef
  });

  const { data: projectsRaw,  isLoading: isLoadingProjects,  error: projectsError } = useQuery({
    queryKey: ["clientProjects", clientRef],
    queryFn: () => fetchClientProjects(clientRef),  // returns { data: [...] }
    enabled: !!clientRef
  });

  const { data: invoicesRaw,     isLoading: isLoadingInvoices,     error: invoicesError } = useQuery({
    queryKey: ["clientInvoices", clientRef],
    queryFn: () => fetchClientInvoices(clientRef),     // returns { data: [...] }
    enabled: !!clientRef
  });

  const { data: meetingsRaw,  isLoading: isLoadingMeetings,  error: meetingsError } = useQuery({
    queryKey: ["clientMeetings", clientRef],
    queryFn: () => fetchClientMeetings(clientRef),  // returns { data: [...] }
    enabled: !!clientRef
  });

  // --- MAPPERS (same style as your clients example) ---
  const client = useMemo(() => {
    const d = (clientRaw as any)?.data;
    if (!d) return undefined;
    const a = d.attributes || {};
    return {
      ref: d.id,
      id: d.id,
      company: a.company,
      contactName: a.contactName ?? a.contact_name,
      email: a.email,
      phone: a.phone,
      address: a.address,
      website: a.website,
      industry: a.industry,
      status: a.status,
      currentProjects: a.currentProjects ?? a.current_projects ?? 0,
      totalProjects: a.totalProjects ?? a.total_projects ?? 0,
      totalValue: a.totalValue ?? a.total_value ?? 0,
      totalPaid: a.totalPaid ?? a.total_paid ?? 0,
      totalOutstanding: a.totalOutstanding ?? a.total_outstanding ?? 0,
      firstProject: a.firstProject ?? a.first_project ?? null,
      lastProject: a.lastProject ?? a.last_project ?? null,
      profitability: a.profitability ?? 0,
    };
  }, [clientRaw]);

  const projects = useMemo(() => {
    const arr = Array.isArray((projectsRaw as any)?.data) ? (projectsRaw as any).data : [];
    return arr.map((e: any) => {
      const a = e.attributes || {};
      return {
        id: e.id,                                      // ref string
        name: a.name,
        status: String(a.status || "").toLowerCase(),  // normalize casing
        start: a.startDate ?? a.start_date ?? "",
        due: a.endDate ?? a.end_date ?? "",
        value: Number(a.budget ?? 0),
        location: a.location ?? "",
        profitability: Number(a.profitability ?? 0),
      };
    });
  }, [projectsRaw]);

  const invoices = useMemo(() => {
    const arr = Array.isArray((invoicesRaw as any)?.data) ? (invoicesRaw as any).data : [];
    return arr.map((e: any) => {
      const a = e.attributes || {};
      const total = Number(a.totalAmount ?? a.total_amount ?? 0);
      const payments = Number(
        a.paidAmount ?? a.payments_total ?? a.payments ?? 0
      );
      return {
        id: e.id,
        reference: a.invoiceNumber ?? a.invoice_number ?? e.id,
        date: a.issueDate ?? a.issue_date ?? "",
        amount: total,
        status: a.status ?? "",
        project: a.projectRef ?? a.project_ref ?? "",
        payments,
        outstanding: Math.max(total - payments, 0),
      };
    });
  }, [invoicesRaw]);

  const meetings = useMemo(() => {
    const arr = Array.isArray((meetingsRaw as any)?.data) ? (meetingsRaw as any).data : [];
    return arr.map((e: any) => {
      const a = e.attributes || {};
      const iso = a.meetingDate ?? a.meeting_date;
      const dt = iso ? new Date(iso) : null;
      return {
        id: e.id,
        title: a.title ?? "",
        date: dt ? dt.toISOString().slice(0, 10) : "",     // YYYY-MM-DD
        time: dt ? dt.toISOString().slice(11, 16) : "",     // HH:mm
        attendees: a.attendees || [],
        project: a.projectRef ?? a.project_ref ?? "",
        location: a.location ?? "",
        ourPersons: a.ourPersons ?? a.our_persons ?? [],
      };
    });
  }, [meetingsRaw]);


  const handleClientUpdate = async (updated: {
    company?: string;
    contactName?: string; // UI camelCase
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    industry?: string;
    status?: string;
  }) => {
    if (!clientRef) return;

    // map UI camelCase -> Rails snake_case where needed
    const payload = {
      company: updated.company,
      contact_name: updated.contactName,  // important mapping
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      website: updated.website,
      industry: updated.industry,
      status: updated.status,
    };

    await updateClient(clientRef, payload);
    await refetchClient();
  };

  return {
    client,      // object | undefined
    projects,    // always array
    invoices,       // always array
    meetings,    // always array
    isLoading: isLoadingClient || isLoadingProjects || isLoadingInvoices || isLoadingMeetings,
    error: clientError || projectsError || invoicesError || meetingsError,
    handleClientUpdate
  };
};
