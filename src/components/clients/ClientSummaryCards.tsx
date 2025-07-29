
import { Card } from "@/components/ui/card";

interface ClientSummaryCardsProps {
  activeProjects: number;
  totalProjects: number;
  totalBillsValue: number;
  paidBills: number;
  nextMeeting: any;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNotesClick: () => void;
}

export const ClientSummaryCards = ({
  activeProjects,
  totalProjects,
  totalBillsValue,
  paidBills,
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

  const outstandingAmount = totalBillsValue - paidBills;

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

      {/* Bills Subtab */}
      <Card 
        className={`p-4 cursor-pointer transition-all h-[100px] w-full ${
          activeTab === 'bills' ? 'bg-blue-50' : 'hover:shadow-md'
        }`} 
        onClick={() => onTabChange('bills')}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Invoiced</h3>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(totalBillsValue)}</div>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Payments Received</h3>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(paidBills)}</div>
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
