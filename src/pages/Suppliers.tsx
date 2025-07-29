import { useState } from "react";
import { Card } from "@/components/ui/card";
import SupplierOverview from "@/components/suppliers/SupplierOverview";
import SupplierFilters from "@/components/suppliers/SupplierFilters";
import SupplierTable from "@/components/suppliers/SupplierTable";
import { Supplier, SupplierFilterState, SupplierColumnVisibility } from "@/types/supplier";

const mockSuppliers: Supplier[] = [{
  id: 1,
  name: "ABC Construction",
  company: "ABC Construction LLC",
  email: "contact@abcconstruction.com",
  phone: "+1 (555) 123-4567",
  address: "123 Builder St, New York, NY 10001",
  currentProjects: 2,
  totalProjects: 5,
  totalValue: 45000,
  totalPaid: 30000,
  totalOutstanding: 15000,
  firstProject: "2023-01-15",
  lastProject: "2025-07-15",
  profitability: 18.5,
  description: "Foundation and structural work specialist"
}, {
  id: 2,
  name: "ElectroMax Ltd",
  company: "ElectroMax Electrical Services",
  email: "info@electromax.com",
  phone: "+1 (555) 987-6543",
  address: "456 Electric Ave, Los Angeles, CA 90210",
  currentProjects: 1,
  totalProjects: 3,
  totalValue: 28000,
  totalPaid: 25000,
  totalOutstanding: 3000,
  firstProject: "2024-03-10",
  lastProject: "2025-08-01",
  profitability: 22.3,
  description: "Electrical installation and maintenance"
}, {
  id: 3,
  name: "PlumbPro Services",
  company: "PlumbPro Plumbing Solutions",
  email: "service@plumbpro.com",
  phone: "+1 (555) 456-7890",
  address: "789 Water St, Chicago, IL 60601",
  currentProjects: 0,
  totalProjects: 2,
  totalValue: 22000,
  totalPaid: 22000,
  totalOutstanding: 0,
  firstProject: "2024-02-10",
  lastProject: "2024-07-20",
  profitability: 15.8,
  description: "Plumbing and water systems"
}, {
  id: 4,
  name: "RoofMasters Inc",
  company: "RoofMasters Roofing",
  email: "jobs@roofmasters.com",
  phone: "+1 (555) 321-0987",
  address: "321 Top St, Miami, FL 33101",
  currentProjects: 1,
  totalProjects: 4,
  totalValue: 38000,
  totalPaid: 20000,
  totalOutstanding: 18000,
  firstProject: "2023-06-01",
  lastProject: "2025-09-15",
  profitability: 19.2,
  description: "Roofing and exterior work"
}];

const Suppliers = () => {
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active">("all");
  const [filters, setFilters] = useState<SupplierFilterState>({
    company: "",
    totalValue: {
      min: "",
      max: ""
    },
    totalProjects: {
      min: "",
      max: ""
    },
    profitability: {
      min: "",
      max: ""
    }
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
    profitability: false
  });

  const activeSuppliers = suppliers.filter(s => s.currentProjects > 0);
  const totalValue = suppliers.reduce((sum, supplier) => sum + supplier.totalValue, 0);
  const totalPaid = suppliers.reduce((sum, supplier) => sum + supplier.totalPaid, 0);
  const totalOutstanding = suppliers.reduce((sum, supplier) => sum + supplier.totalOutstanding, 0);
  const hasActiveFilters = Object.values(filters).some(filter => typeof filter === 'string' ? filter !== '' : filter.min !== '' || filter.max !== '');

  const getFilteredSuppliers = () => {
    let filtered = suppliers;

    // Status filter from tabs
    if (statusFilter === "active") {
      filtered = filtered.filter(s => s.currentProjects > 0);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier => supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) || supplier.email.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Additional filters
    if (filters.company) {
      filtered = filtered.filter(s => s.company.toLowerCase().includes(filters.company.toLowerCase()));
    }
    if (filters.totalValue.min) {
      filtered = filtered.filter(s => s.totalValue >= parseInt(filters.totalValue.min));
    }
    if (filters.totalValue.max) {
      filtered = filtered.filter(s => s.totalValue <= parseInt(filters.totalValue.max));
    }
    if (filters.totalProjects.min) {
      filtered = filtered.filter(s => s.totalProjects >= parseInt(filters.totalProjects.min));
    }
    if (filters.totalProjects.max) {
      filtered = filtered.filter(s => s.totalProjects <= parseInt(filters.totalProjects.max));
    }
    if (filters.profitability.min) {
      filtered = filtered.filter(s => s.profitability >= parseFloat(filters.profitability.min));
    }
    if (filters.profitability.max) {
      filtered = filtered.filter(s => s.profitability <= parseFloat(filters.profitability.max));
    }
    return filtered;
  };

  const filteredSuppliers = getFilteredSuppliers();
  const clearFilters = () => {
    setFilters({
      company: "",
      totalValue: {
        min: "",
        max: ""
      },
      totalProjects: {
        min: "",
        max: ""
      },
      profitability: {
        min: "",
        max: ""
      }
    });
  };

  return (
    <div className="space-y-6 my-[16px] mx-[16px]">
      {/* Vendor Overview */}
      <SupplierOverview
        totalSuppliers={suppliers.length}
        activeSuppliers={activeSuppliers.length}
        totalValue={totalValue}
        totalPaid={totalPaid}
        totalOutstanding={totalOutstanding}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Vendor List */}
      <Card className="p-6 px-[16px] py-[16px]">
        {/* Search and Controls */}
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

        {/* Vendors Table */}
        <SupplierTable suppliers={filteredSuppliers} columnVisibility={columnVisibility} />
      </Card>
    </div>
  );
};

export default Suppliers;
