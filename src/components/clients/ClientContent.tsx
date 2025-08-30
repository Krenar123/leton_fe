import { useState } from "react";
import { Client } from "@/types/client";
import { ClientSummaryCards } from "./ClientSummaryCards";
import { ClientProjectsTable } from "./ClientProjectsTable";
import { ClientInvoicesTable } from "./ClientInvoicesTable";
import { ClientMeetingsTable } from "./ClientMeetingsTable";
import { ClientListFilters } from "./ClientListFilters";
import { Card } from "@/components/ui/card";

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

interface ClientInvoice {
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

interface ClientContentProps {
  client: Client;
  projects: ClientProject[];
  invoices: ClientInvoice[];
  meetings: ClientMeeting[];
  hasNewNotes: boolean;
  viewedNotes: boolean;
  onNotesClick: () => void;
  onContactClick: () => void;
}

export const ClientContent = ({
  client,
  projects,
  invoices,
  meetings,
  hasNewNotes,
  viewedNotes,
  onNotesClick,
  onContactClick
}: ClientContentProps) => {
  const [activeTab, setActiveTab] = useState("projects");
  const [searchTerm, setSearchTerm] = useState("");

  // Column visibility state for different tabs
  const [projectColumns, setProjectColumns] = useState({
    location: true,
    start: true,
    due: true,
    value: true,
    profitability: true,
    status: true
  });
  const [invoiceColumns, setInvoiceColumns] = useState({
    billed: true,
    payments: true,
    outstanding: true,
    dueDate: true,
    status: true
  });
  const [meetingColumns, setMeetingColumns] = useState({
    ourPersons: true,
    description: true,
    project: true,
    location: true,
    date: true,
    time: true
  });

  const activeProjects = client.currentProjects; //projects.filter(p => p.status === 'Active');
  const totalInvoicesValue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = invoices.reduce((sum, invoice) => sum + invoice.payments, 0);
  const nextMeeting = meetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const handleColumnVisibilityChange = (column: string, value: boolean) => {
    if (activeTab === 'projects') {
      setProjectColumns(prev => ({
        ...prev,
        [column]: value
      }));
    } else if (activeTab === 'invoices') {
      setInvoiceColumns(prev => ({
        ...prev,
        [column]: value
      }));
    } else if (activeTab === 'meetings') {
      setMeetingColumns(prev => ({
        ...prev,
        [column]: value
      }));
    }
  };

  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'projects':
        return projectColumns;
      case 'invoices':
        return invoiceColumns;
      case 'meetings':
        return meetingColumns;
      default:
        return {};
    }
  };

  return (
    <Card className="mx-[16px] my-[16px] p-8 bg-white border border-border py-[24px] px-[24px]">
      <div className="space-y-6">
        {/* Summary Cards and Notes */}
        <ClientSummaryCards 
          activeProjects={activeProjects} 
          totalProjects={projects.length} 
          totalInvoicesValue={totalInvoicesValue} 
          paidInvoices={paidInvoices} 
          nextMeeting={nextMeeting} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onNotesClick={onNotesClick} 
        />

        {/* List Header */}
        <ClientListFilters 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          activeTab={activeTab} 
          currentColumns={getCurrentColumns()} 
          onColumnVisibilityChange={handleColumnVisibilityChange} 
        />

        {/* Main Content based on active tab */}
        <div className="space-y-6">
          {activeTab === 'projects' && 
            <ClientProjectsTable 
              projects={projects} 
              searchTerm={searchTerm} 
              projectColumns={projectColumns} 
            />
          }

          {activeTab === 'invoices' && 
            <ClientInvoicesTable 
              invoices={invoices}
              searchTerm={searchTerm} 
              invoiceColumns={invoiceColumns} 
            />
          }

          {activeTab === 'meetings' && 
            <ClientMeetingsTable 
              meetings={meetings} 
              searchTerm={searchTerm} 
              meetingColumns={meetingColumns} 
            />
          }
        </div>
      </div>
    </Card>
  );
};
