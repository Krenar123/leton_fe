
import { Card } from "@/components/ui/card";

interface ClientOverviewProps {
  totalClients: number;
  activeClients: number;
  totalValue: number;
  totalPaid: number;
  totalOutstanding: number;
  statusFilter: "all" | "active";
  onStatusChange: (status: "all" | "active") => void;
}

const ClientOverview = ({
  totalClients,
  activeClients,
  totalValue,
  totalPaid,
  totalOutstanding,
  statusFilter,
  onStatusChange
}: ClientOverviewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Clients */}
      <Card 
        className={`p-6 cursor-pointer transition-all hover:shadow-md relative ${
          statusFilter === "all" 
            ? 'bg-gradient-to-br from-[#E6ECEF] to-[#D1D8E0] border-l-4 border-l-yellow-500 shadow-md' 
            : 'bg-[#E6ECEF] hover:bg-gray-50 border-l-2 border-l-gray-300'
        }`} 
        onClick={() => onStatusChange("all")}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalClients}</div>
          <div className="text-sm text-gray-600">Total Clients</div>
        </div>
      </Card>

      {/* Active Clients */}
      <Card 
        className={`p-6 cursor-pointer transition-all hover:shadow-md relative ${
          statusFilter === "active" 
            ? 'bg-gradient-to-br from-[#E6ECEF] to-[#D1D8E0] border-l-4 border-l-yellow-500 shadow-md' 
            : 'bg-[#E6ECEF] hover:bg-gray-50 border-l-2 border-l-gray-300'
        }`} 
        onClick={() => onStatusChange("active")}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{activeClients}</div>
          <div className="text-sm text-gray-600">Active Clients</div>
        </div>
      </Card>

      {/* Financial Overview */}
      <Card className="p-6 bg-slate-400">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white font-semibold text-base">Total Value:</span>
            <span className="text-white font-semibold text-2xl">{formatCurrency(totalValue)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">Payments Received:</span>
            <span className="text-white font-semibold text-lg">{formatCurrency(totalPaid)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">Outstanding:</span>
            <span className="text-white font-semibold text-lg">{formatCurrency(totalOutstanding)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClientOverview;
