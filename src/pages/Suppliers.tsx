// src/pages/Suppliers.tsx
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import SupplierOverview from "@/components/suppliers/SupplierOverview";
import SupplierFilters from "@/components/suppliers/SupplierFilters";
import SupplierTable from "@/components/suppliers/SupplierTable";
import { Supplier, SupplierFilterState, SupplierColumnVisibility } from "@/types/supplier";
import { fetchSuppliers } from "@/services/api";

const Suppliers = () => {
  // 1) Fetch RAW JSON:API from BE
  const { data: suppliersRaw, isLoading, error } = useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  });

  // 2) Map JSON:API -> flat array your UI expects
  const suppliers: Supplier[] = useMemo(() => {
    const arr = Array.isArray(suppliersRaw?.data) ? suppliersRaw.data : [];
    return arr.map((entry: any) => {
      const a = entry.attributes || {};
      return {
        // Your table uses numeric id; we can keep string safely as id (or create hash)
        id: entry.id,                       // use `ref`/id from BE as stable identifier
        name: a.contactName || a.company || "",
        company: a.company || "",
        email: a.email || "",
        phone: a.phone || "",
        address: a.address || "",
        currentProjects: a.currentProjects ?? 0,
        totalProjects: a.totalProjects ?? 0,
        totalValue: a.totalValue ?? 0,
        totalPaid: a.totalPaid ?? 0,
        totalOutstanding: a.totalOutstanding ?? 0,
        firstProject: a.firstProject || "",
        lastProject: a.lastProject || "",
        profitability: a.profitability ?? 0,
        description: "", // not provided by BE; keep empty for now
        __ref: entry.id, // handy if you need to navigate by ref later
      } as Supplier;
    });
  }, [suppliersRaw]);

  // 3) Local UI state (unchanged)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active">("all");
  const [filters, setFilters] = useState<SupplierFilterState>({
    company: "",
    totalValue: { min: "", max: "" },
    totalProjects: { min: "", max: "" },
    profitability: { min: "", max: "" },
  });
  const [columnVisibility, setColumnVisibility] = useState<SupplierColumnVisibility>({
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

  // 4) Overview numbers
  const activeSuppliers = useMemo(
    () => suppliers.filter(s => (s.currentProjects ?? 0) > 0),
    [suppliers]
  );
  const totalValue = useMemo(
    () => suppliers.reduce((sum, s) => sum + (s.totalValue ?? 0), 0),
    [suppliers]
  );
  const totalPaid = useMemo(
    () => suppliers.reduce((sum, s) => sum + (s.totalPaid ?? 0), 0),
    [suppliers]
  );
  const totalOutstanding = useMemo(
    () => suppliers.reduce((sum, s) => sum + (s.totalOutstanding ?? 0), 0),
    [suppliers]
  );

  // 5) Filters
  const hasActiveFilters =
    filters.company !== "" ||
    filters.totalValue.min !== "" || filters.totalValue.max !== "" ||
    filters.totalProjects.min !== "" || filters.totalProjects.max !== "" ||
    filters.profitability.min !== "" || filters.profitability.max !== "";

  const filteredSuppliers: Supplier[] = useMemo(() => {
    let filtered = suppliers.slice();

    if (statusFilter === "active") {
      filtered = filtered.filter(s => (s.currentProjects ?? 0) > 0);
    }

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(sup =>
        (sup.name || "").toLowerCase().includes(s) ||
        (sup.company || "").toLowerCase().includes(s) ||
        (sup.email || "").toLowerCase().includes(s)
      );
    }

    if (filters.company) {
      const s = filters.company.toLowerCase();
      filtered = filtered.filter(sup => (sup.company || "").toLowerCase().includes(s));
    }

    if (filters.totalValue.min) filtered = filtered.filter(sup => (sup.totalValue ?? 0) >= parseFloat(filters.totalValue.min));
    if (filters.totalValue.max) filtered = filtered.filter(sup => (sup.totalValue ?? 0) <= parseFloat(filters.totalValue.max));

    if (filters.totalProjects.min) filtered = filtered.filter(sup => (sup.totalProjects ?? 0) >= parseInt(filters.totalProjects.min));
    if (filters.totalProjects.max) filtered = filtered.filter(sup => (sup.totalProjects ?? 0) <= parseInt(filters.totalProjects.max));

    if (filters.profitability.min) filtered = filtered.filter(sup => (sup.profitability ?? 0) >= parseFloat(filters.profitability.min));
    if (filters.profitability.max) filtered = filtered.filter(sup => (sup.profitability ?? 0) <= parseFloat(filters.profitability.max));

    return filtered;
  }, [suppliers, statusFilter, searchTerm, filters]);

  const clearFilters = () => {
    setFilters({
      company: "",
      totalValue: { min: "", max: "" },
      totalProjects: { min: "", max: "" },
      profitability: { min: "", max: "" },
    });
  };

  // 6) Loading / error
  if (isLoading) return <div className="px-6 py-6">Loading suppliers…</div>;
  if (error) return <div className="px-6 py-6 text-red-600">Failed to load suppliers.</div>;

  // 7) Render
  return (
    <div className="space-y-6 my-[16px] mx-[16px]">
      <SupplierOverview
        totalSuppliers={suppliers.length}
        activeSuppliers={activeSuppliers.length}
        totalValue={totalValue}
        totalPaid={totalPaid}
        totalOutstanding={totalOutstanding}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <Card className="p-6 px-[16px] py-[16px]">
        <SupplierFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <SupplierTable
          suppliers={filteredSuppliers}
          columnVisibility={columnVisibility}
        />
      </Card>
    </div>
  );
};

export default Suppliers;
