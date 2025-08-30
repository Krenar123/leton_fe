
import { Card } from "@/components/ui/card";

interface ClientSummaryCardsProps {
  activeProjects: number;
  totalProjects: number;
  totalInvoicesValue: number;
  paidInvoices: number;
  nextMeeting: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNotesClick: () => void;
}

export const ClientSummaryCards = ({
  activeProjects,
  totalProjects,
  totalInvoicesValue,
  paidInvoices,
  nextMeeting,
  activeTab,
  onTabChange,
  onNotesClick
}: ClientSummaryCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const outstandingAmount = totalInvoicesValue - paidInvoices;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Projects Subtab */}
      <Card 
        className={`p-4 cursor-pointer transition-all h-[100px] w-full ${
          activeTab === 'projects' ? 'bg-blue-50' : 'hover:shadow-md'
        }`} 
        onClick={() => onTabChange('projects')}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-2 text-left">Active Projects</h3>
            <div className="text-2xl font-bold text-gray-900">{activeProjects}</div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-2 text-left">Total Projects</h3>
            <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
          </div>
        </div>
      </Card>

      {/* Invoices Subtab */}
      <Card 
        className={`p-4 cursor-pointer transition-all h-[100px] w-full ${
          activeTab === 'invoices' ? 'bg-blue-50' : 'hover:shadow-md'
        }`} 
        onClick={() => onTabChange('invoices')}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Invoiced</h3>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(totalInvoicesValue)}</div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Payments Received</h3>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(paidInvoices)}</div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Outstanding</h3>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(outstandingAmount)}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
