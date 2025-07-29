import { useState } from "react";
import { Supplier } from "@/types/supplier";
import { SupplierSummaryCards } from "./SupplierSummaryCards";
import { SupplierProjectsTable } from "./SupplierProjectsTable";
import { SupplierBillsTable } from "./SupplierBillsTable";
import { SupplierListFilters } from "./SupplierListFilters";
interface SupplierProject {
  id: number;
  name: string;
  status: string;
  start: string;
  due: string;
  value: number;
  location: string;
  profitability: number;
}
interface SupplierBill {
  id: number;
  billNr: string;
  billSubject: string;
  project: string;
  billed: number;
  paid: number;
  outstanding: number;
  billDate: string;
  dueDate: string;
  status: string;
}
interface SupplierContentProps {
  supplier: Supplier;
  projects: SupplierProject[];
  invoices: any[];
  bills: SupplierBill[];
  meetings: any[];
  hasNewNotes: boolean;
  viewedNotes: boolean;
  onNotesClick: () => void;
  onContactClick: () => void;
}
export const SupplierContent = ({
  supplier,
  projects,
  invoices,
  bills,
  meetings,
  hasNewNotes,
  viewedNotes,
  onNotesClick,
  onContactClick
}: SupplierContentProps) => {
  const [activeTab, setActiveTab] = useState("projects");
  const [searchTerm, setSearchTerm] = useState("");

  // Column visibility states
  const [projectColumns, setProjectColumns] = useState({
    location: true,
    start: true,
    due: true,
    value: true,
    profitability: true,
    status: true
  });
  const [billColumns, setBillColumns] = useState({
    billNr: true,
    billSubject: true,
    project: true,
    billed: true,
    paid: true,
    outstanding: true,
    billDate: true,
    dueDate: true,
    status: true
  });
  const activeProjects = projects.filter(p => p.status === 'Active');
  const totalBillsValue = bills.reduce((sum, bill) => sum + bill.billed, 0);
  const paidBills = bills.reduce((sum, bill) => sum + bill.paid, 0);
  const handleColumnVisibilityChange = (column: string, value: boolean) => {
    if (activeTab === 'projects') {
      setProjectColumns(prev => ({
        ...prev,
        [column]: value
      }));
    } else if (activeTab === 'bills') {
      setBillColumns(prev => ({
        ...prev,
        [column]: value
      }));
    }
  };
  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'projects':
        return projectColumns;
      case 'bills':
        return billColumns;
      default:
        return projectColumns;
    }
  };
  const renderTable = () => {
    switch (activeTab) {
      case 'projects':
        return <SupplierProjectsTable projects={projects} searchTerm={searchTerm} projectColumns={projectColumns} />;
      case 'bills':
        return <SupplierBillsTable bills={bills} searchTerm={searchTerm} billColumns={billColumns} />;
      default:
        return <SupplierProjectsTable projects={projects} searchTerm={searchTerm} projectColumns={projectColumns} />;
    }
  };
  return <div className="bg-white rounded-lg space-y-6 border border-border px-[24px] py-[24px] mx-[16px] my-[16px]">
      {/* Summary Cards */}
      <SupplierSummaryCards activeProjects={activeProjects.length} totalProjects={projects.length} totalInvoicesValue={totalBillsValue} paidInvoices={paidBills} outstandingAmount={totalBillsValue - paidBills} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* List Header with Search and Filters */}
      <SupplierListFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} activeTab={activeTab} currentColumns={getCurrentColumns()} onColumnVisibilityChange={handleColumnVisibilityChange} />

      {/* Dynamic Table */}
      {renderTable()}
    </div>;
};