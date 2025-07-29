import { useState, useEffect } from "react";
import { Client } from "@/types/client";

interface ClientProject {
  id: number;
  name: string;
  status: string;
  start: string;
  due: string;
  value: number;
  location: string;
  profitability: number;
}

interface ClientBill {
  id: number;
  reference: string;
  date: string;
  amount: number;
  status: string;
  project: string;
  payments: number;
  outstanding: number;
}

interface ClientMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  attendees: string[];
  project?: string;
  location?: string;
  ourPersons?: string[];
}

const mockClients: Client[] = [
  {
    id: 1,
    name: "John Smith",
    company: "Smith Construction LLC",
    email: "john@smithconstruction.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
    businessNumber: "BN123456789",
    vat: "VAT987654321",
    currentProjects: 2,
    totalProjects: 3,
    totalValue: 1250000,
    totalPaid: 950000,
    totalOutstanding: 300000,
    firstProject: "2023-01-15",
    lastProject: "2025-07-15",
    profitability: 18.5,
    description: "Long-term construction client"
  },
  {
    id: 2,
    name: "Anna Wilson",
    company: "Wilson Architects",
    email: "anna@wilsonarch.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    businessNumber: "BN456789123",
    currentProjects: 1,
    totalProjects: 2,
    totalValue: 800000,
    totalPaid: 800000,
    totalOutstanding: 0,
    firstProject: "2024-03-10",
    lastProject: "2025-08-01",
    profitability: 22.3,
    description: "Architectural design projects"
  },
  {
    id: 3,
    name: "David Brown",
    company: "Brown Development Group",
    email: "david@browndevelopment.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine St, Chicago, IL 60601",
    businessNumber: "BN789123456",
    vat: "VAT456789123",
    currentProjects: 0,
    totalProjects: 1,
    totalValue: 950000,
    totalPaid: 950000,
    totalOutstanding: 0,
    firstProject: "2024-02-10",
    lastProject: "2024-07-20",
    profitability: 12.8,
    description: "Commercial development client"
  }
];

const mockProjects: ClientProject[] = [
  {
    id: 1,
    name: "Office Building Renovation",
    status: "Active",
    start: "2025-07-15",
    due: "2025-12-30",
    value: 250000,
    location: "New York, NY",
    profitability: 15.5
  },
  {
    id: 2,
    name: "Residential Complex",
    status: "Active",
    start: "2025-08-01",
    due: "2026-06-15",
    value: 1200000,
    location: "Los Angeles, CA",
    profitability: 22.3
  },
  {
    id: 3,
    name: "Mall Expansion",
    status: "Completed",
    start: "2025-02-10",
    due: "2025-07-20",
    value: 800000,
    location: "Chicago, IL",
    profitability: 18.7
  }
];

const mockBills: ClientBill[] = [
  {
    id: 1,
    reference: "Foundation Work",
    date: "2025-08-15",
    amount: 7200,
    status: "In Progress",
    project: "Office Building Renovation",
    payments: 4000,
    outstanding: 3200
  },
  {
    id: 2,
    reference: "Electrical Installation",
    date: "2025-09-16",
    amount: 4200,
    status: "Not Started",
    project: "Residential Complex",
    payments: 2200,
    outstanding: 2000
  },
  {
    id: 3,
    reference: "Plumbing",
    date: "2025-09-20",
    amount: 3100,
    status: "Completed",
    project: "Mall Expansion",
    payments: 3100,
    outstanding: 0
  }
];

const mockMeetings: ClientMeeting[] = [
  {
    id: 1,
    title: "Client Review - Office Building Progress",
    date: "2025-07-12",
    time: "14:00",
    attendees: ["John Smith"],
    project: "Office Building Renovation",
    location: "Conference Room A",
    ourPersons: ["Sarah Johnson", "Mike Davis"]
  },
  {
    id: 2,
    title: "Team Standup - Residential Complex",
    date: "2025-07-15",
    time: "09:00",
    attendees: ["Anna Wilson"],
    project: "Residential Complex",
    location: "Teams Meeting",
    ourPersons: ["Mike Davis"]
  },
  {
    id: 3,
    title: "Project Kickoff Meeting",
    date: "2025-07-18",
    time: "10:30",
    attendees: ["David Brown"],
    project: "Shopping Mall Renovation",
    location: "Client Office",
    ourPersons: ["Sarah Johnson", "Tom Wilson"]
  }
];

export const useClientData = (clientId: string) => {
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const id = parseInt(clientId || "0");
    const foundClient = mockClients.find(c => c.id === id);
    setClient(foundClient || null);
  }, [clientId]);

  const handleClientUpdate = (updatedClient: Client) => {
    setClient(updatedClient);
    console.log('Client updated:', updatedClient);
  };

  return {
    client,
    projects: mockProjects,
    bills: mockBills,
    meetings: mockMeetings,
    handleClientUpdate
  };
};
