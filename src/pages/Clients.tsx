import { useState } from "react";
import { Card } from "@/components/ui/card";
import ClientOverview from "@/components/clients/ClientOverview";
import ClientFilters from "@/components/clients/ClientFilters";
import ClientTable from "@/components/clients/ClientTable";
import { Client, ClientFilterState, ClientColumnVisibility } from "@/types/client";
const mockClients: Client[] = [{
  id: 1,
  name: "John Smith",
  company: "Smith Construction LLC",
  email: "john@smithconstruction.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, New York, NY 10001",
  currentProjects: 2,
  totalProjects: 3,
  totalValue: 1250000,
  totalPaid: 950000,
  totalOutstanding: 300000,
  firstProject: "2023-01-15",
  lastProject: "2025-07-15",
  profitability: 18.5,
  description: "Long-term construction client"
}, {
  id: 2,
  name: "Anna Wilson",
  company: "Wilson Architects",
  email: "anna@wilsonarch.com",
  phone: "+1 (555) 987-6543",
  address: "456 Oak Ave, Los Angeles, CA 90210",
  currentProjects: 1,
  totalProjects: 2,
  totalValue: 800000,
  totalPaid: 800000,
  totalOutstanding: 0,
  firstProject: "2024-03-10",
  lastProject: "2025-08-01",
  profitability: 22.3,
  description: "Architectural design projects"
}, {
  id: 3,
  name: "David Brown",
  company: "Brown Development Group",
  email: "david@browndevelopment.com",
  phone: "+1 (555) 456-7890",
  address: "789 Pine St, Chicago, IL 60601",
  currentProjects: 0,
  totalProjects: 1,
  totalValue: 950000,
  totalPaid: 950000,
  totalOutstanding: 0,
  firstProject: "2024-02-10",
  lastProject: "2024-07-20",
  profitability: 12.8,
  description: "Commercial development client"
}];
const Clients = () => {
  const [clients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active">("all");
  const [filters, setFilters] = useState<ClientFilterState>({
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
    profitability: false
  });
  const activeClients = clients.filter(c => c.currentProjects > 0);
  const totalValue = clients.reduce((sum, client) => sum + client.totalValue, 0);
  const totalPaid = clients.reduce((sum, client) => sum + client.totalPaid, 0);
  const totalOutstanding = clients.reduce((sum, client) => sum + client.totalOutstanding, 0);
  const hasActiveFilters = Object.values(filters).some(filter => typeof filter === 'string' ? filter !== '' : filter.min !== '' || filter.max !== '');
  const getFilteredClients = () => {
    let filtered = clients;

    // Status filter from tabs
    if (statusFilter === "active") {
      filtered = filtered.filter(c => c.currentProjects > 0);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.company.toLowerCase().includes(searchTerm.toLowerCase()) || client.email.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Additional filters
    if (filters.company) {
      filtered = filtered.filter(c => c.company.toLowerCase().includes(filters.company.toLowerCase()));
    }
    if (filters.totalValue.min) {
      filtered = filtered.filter(c => c.totalValue >= parseInt(filters.totalValue.min));
    }
    if (filters.totalValue.max) {
      filtered = filtered.filter(c => c.totalValue <= parseInt(filters.totalValue.max));
    }
    if (filters.totalProjects.min) {
      filtered = filtered.filter(c => c.totalProjects >= parseInt(filters.totalProjects.min));
    }
    if (filters.totalProjects.max) {
      filtered = filtered.filter(c => c.totalProjects <= parseInt(filters.totalProjects.max));
    }
    if (filters.profitability.min) {
      filtered = filtered.filter(c => c.profitability >= parseFloat(filters.profitability.min));
    }
    if (filters.profitability.max) {
      filtered = filtered.filter(c => c.profitability <= parseFloat(filters.profitability.max));
    }
    return filtered;
  };
  const filteredClients = getFilteredClients();
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
  return <div className="space-y-6 px-0 mx-[16px] py-0 my-[16px]">
      {/* Client Overview */}
      <ClientOverview totalClients={clients.length} activeClients={activeClients.length} totalValue={totalValue} totalPaid={totalPaid} totalOutstanding={totalOutstanding} statusFilter={statusFilter} onStatusChange={setStatusFilter} />

      {/* Client List */}
      <Card className="p-6 px-[16px] py-[16px]">
        {/* Search and Controls */}
        <ClientFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} filters={filters} onFiltersChange={setFilters} columnVisibility={columnVisibility} onColumnVisibilityChange={setColumnVisibility} hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters} />

        {/* Clients Table */}
        <ClientTable clients={filteredClients} columnVisibility={columnVisibility} />
      </Card>
    </div>;
};
export default Clients;