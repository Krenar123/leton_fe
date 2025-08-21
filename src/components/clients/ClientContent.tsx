import { useState } from "react";
import { Client } from "@/types/client";
import { ClientSummaryCards } from "./ClientSummaryCards";
import { ClientProjectsTable } from "./ClientProjectsTable";
import { ClientBillsTable } from "./ClientBillsTable";
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

interface ClientContentProps {
  client: Client;
  projects: ClientProject[];
  bills: ClientBill[];
  meetings: ClientMeeting[];
  hasNewNotes: boolean;
  viewedNotes: boolean;
  onNotesClick: () => void;
  onContactClick: () => void;
}

export const ClientContent = ({
  client,
  projects,
  bills,
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
  const [billColumns, setBillColumns] = useState({
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
  const totalBillsValue = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidBills = bills.reduce((sum, bill) => sum + bill.payments, 0);
  const nextMeeting = meetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

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
      case 'bills':
        return billColumns;
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
          totalBillsValue={totalBillsValue} 
          paidBills={paidBills} 
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

          {activeTab === 'bills' && 
            <ClientBillsTable 
              bills={bills} 
              searchTerm={searchTerm} 
              billColumns={billColumns} 
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
