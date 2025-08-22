// src/pages/Clients.tsx
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import ClientOverview from "@/components/clients/ClientOverview";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientTable from "@/components/clients/ClientTable";
import { Client, ClientFilterState, ClientColumnVisibility } from "@/types/client";
import { fetchClients } from "@/services/api";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active">("all");
  const [filters, setFilters] = useState<ClientFilterState>({
    company: "",
    totalValue: { min: "", max: "" },
    totalProjects: { min: "", max: "" },
    profitability: { min: "", max: "" },
  });
  const [columnVisibility, setColumnVisibility] = useState<ClientColumnVisibility>({
    company: true,
    email: false,
    phone: false,
    address: false,
    totalValue: true,
    totalPaid: true,
    totalOutstanding: true,
    firstProject: false,
    lastProject: false,
    profitability: false,
  });

  // 1) fetch RAW jsonapi
  const { data: clientsRaw, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });


  // 2) map raw -> flat array (ref/id + attributes)
  const clients: any[] = useMemo(() => {
    const arr = Array.isArray(clientsRaw?.data) ? clientsRaw.data : [];
    return arr.map((entry: any) => {
      const a = entry.attributes || {};
      return {
        ref: a.ref,
        id: entry.id,
        company: a.company,
        contactName: a.contactName,
        email: a.email,
        phone: a.phone,
        address: a.address,
        website: a.website,
        industry: a.industry,
        status: a.status, // "active" | "inactive" | "prospect"
        currentProjects: a.currentProjects ?? 0,
        totalProjects: a.totalProjects ?? 0,
        totalValue: a.totalValue ?? 0,
        totalPaid: a.totalPaid ?? 0,
        totalOutstanding: a.totalOutstanding ?? 0,
        firstProject: a.firstProject || null,
        lastProject: a.lastProject || null,
        profitability: a.profitability ?? 0,
      };
    });
  }, [clientsRaw]);

  const activeClients = useMemo(
    () => clients.filter(c => (c.currentProjects ?? 0) > 0),
    [clients]
  );

  const totalValue = useMemo(
    () => clients.reduce((sum, c) => sum + (c.totalValue ?? 0), 0),
    [clients]
  );
  const totalPaid = useMemo(
    () => clients.reduce((sum, c) => sum + (c.totalPaid ?? 0), 0),
    [clients]
  );
  const totalOutstanding = useMemo(
    () => clients.reduce((sum, c) => sum + (c.totalOutstanding ?? 0), 0),
    [clients]
  );

  const hasActiveFilters =
    filters.company !== "" ||
    filters.totalValue.min !== "" || filters.totalValue.max !== "" ||
    filters.totalProjects.min !== "" || filters.totalProjects.max !== "" ||
    filters.profitability.min !== "" || filters.profitability.max !== "";

  const filteredClients = useMemo(() => {
    let filtered = clients.slice();

    if (statusFilter === "active") {
      filtered = filtered.filter(c => (c.currentProjects ?? 0) > 0);
    }

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        (c.company || "").toLowerCase().includes(s) ||
        (c.contactName || "").toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s)
      );
    }

    if (filters.company) {
      const s = filters.company.toLowerCase();
      filtered = filtered.filter(c => (c.company || "").toLowerCase().includes(s));
    }

    if (filters.totalValue.min) filtered = filtered.filter(c => (c.totalValue ?? 0) >= parseFloat(filters.totalValue.min));
    if (filters.totalValue.max) filtered = filtered.filter(c => (c.totalValue ?? 0) <= parseFloat(filters.totalValue.max));

    if (filters.totalProjects.min) filtered = filtered.filter(c => (c.totalProjects ?? 0) >= parseInt(filters.totalProjects.min));
    if (filters.totalProjects.max) filtered = filtered.filter(c => (c.totalProjects ?? 0) <= parseInt(filters.totalProjects.max));

    if (filters.profitability.min) filtered = filtered.filter(c => (c.profitability ?? 0) >= parseFloat(filters.profitability.min));
    if (filters.profitability.max) filtered = filtered.filter(c => (c.profitability ?? 0) <= parseFloat(filters.profitability.max));

    return filtered;
  }, [clients, statusFilter, searchTerm, filters]);

  const clearFilters = () => {
    setFilters({
      company: "",
      totalValue: { min: "", max: "" },
      totalProjects: { min: "", max: "" },
      profitability: { min: "", max: "" },
    });
  };

  if (isLoading) return <div className="px-6 py-6">Loading clients…</div>;
  if (error) return <div className="px-6 py-6 text-red-600">{(error as any).message || "Failed to load clients"}</div>;

  return (
    <div className="space-y-6 px-0 mx-[16px] py-0 my-[16px]">
      <ClientOverview
        totalClients={clients.length}
        activeClients={activeClients.length}
        totalValue={totalValue}
        totalPaid={totalPaid}
        totalOutstanding={totalOutstanding}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <Card className="p-6 px-[16px] py-[16px]">
        <ClientFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <ClientTable
          clients={filteredClients.map(c => ({
            id: c.ref,                                     // use ref everywhere
            name: c.contactName || c.company,
            company: c.company,
            email: c.email || "",
            phone: c.phone || "",
            address: c.address || "",
            currentProjects: c.currentProjects ?? 0,
            totalProjects: c.totalProjects ?? 0,
            totalValue: c.totalValue ?? 0,
            totalPaid: c.totalPaid ?? 0,
            totalOutstanding: c.totalOutstanding ?? 0,
            firstProject: c.firstProject || "",
            lastProject: c.lastProject || "",
            profitability: c.profitability ?? 0,
            __ref: c.ref,
          }))}
          columnVisibility={columnVisibility}
        />
      </Card>
    </div>
  );
};

export default Clients;
