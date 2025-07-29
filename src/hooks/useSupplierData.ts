import { useState, useEffect } from "react";
import { Supplier } from "@/types/supplier";

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

interface SupplierInvoice {
  id: number;
  reference: string;
  date: string;
  amount: number;
  status: string;
  project: string;
  payments: number;
  outstanding: number;
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

interface SupplierMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  attendees: string[];
  project?: string;
  location?: string;
  ourPersons?: string[];
}

// Mock data for vendor details
const mockSupplierData = {
  "1": {
    supplier: {
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
    },
    projects: [
      {
        id: 1,
        name: "Office Building Renovation",
        status: "Active",
        start: "2025-07-15",
        due: "2025-12-30",
        value: 25000,
        location: "New York, NY",
        profitability: 15.5
      },
      {
        id: 2,
        name: "Residential Complex",
        status: "Active",
        start: "2025-08-01",
        due: "2026-06-15",
        value: 20000,
        location: "Brooklyn, NY",
        profitability: 22.3
      }
    ],
    invoices: [
      {
        id: 1,
        reference: "INV-2025-001",
        date: "2025-07-15",
        amount: 14500,
        status: "Partial",
        project: "Office Building Renovation",
        payments: 9300,
        outstanding: 5200
      }
    ],
    bills: [
      {
        id: 1,
        billNr: "BILL-2025-001",
        billSubject: "Foundation Materials",
        project: "Office Building Renovation",
        billed: 12500,
        paid: 8000,
        outstanding: 4500,
        billDate: "2025-07-10",
        dueDate: "2025-08-10",
        status: "outstanding"
      },
      {
        id: 2,
        billNr: "BILL-2025-002",
        billSubject: "Concrete Supply",
        project: "Residential Complex",
        billed: 8500,
        paid: 8500,
        outstanding: 0,
        billDate: "2025-07-05",
        dueDate: "2025-08-05",
        status: "paid"
      }
    ],
    meetings: [
      {
        id: 1,
        title: "Progress Review - Office Building",
        date: "2025-07-12",
        time: "10:00",
        attendees: ["John Smith", "Mike Johnson"],
        project: "Office Building Renovation",
        location: "Site Office",
        ourPersons: ["Sarah Wilson", "Tom Brown"]
      }
    ]
  }
};

export const useSupplierData = (supplierId: string) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [projects, setProjects] = useState<SupplierProject[]>([]);
  const [invoices, setInvoices] = useState<SupplierInvoice[]>([]);
  const [bills, setBills] = useState<SupplierBill[]>([]);
  const [meetings, setMeetings] = useState<SupplierMeeting[]>([]);

  useEffect(() => {
    // Mock API call
    const data = mockSupplierData[supplierId as keyof typeof mockSupplierData];
    if (data) {
      setSupplier(data.supplier);
      setProjects(data.projects);
      setInvoices(data.invoices);
      setBills(data.bills);
      setMeetings(data.meetings);
    }
  }, [supplierId]);

  const handleSupplierUpdate = (updatedSupplier: Supplier) => {
    setSupplier(updatedSupplier);
    console.log("Vendor updated:", updatedSupplier);
  };

  return {
    supplier,
    projects,
    invoices,
    bills,
    meetings,
    handleSupplierUpdate
  };
};
