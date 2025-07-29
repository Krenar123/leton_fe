
import { Card } from "@/components/ui/card";
import { DollarSign, CreditCard, FileText } from "lucide-react";

interface Project {
  id: number;
  name: string;
  client: string;
  location: string;
  start: string;
  due: string;
  value: number;
  profitability: number;
  status: "Active" | "Completed";
  description?: string;
}

interface FinancialsCardProps {
  project: Project;
  onClick: () => void;
}

export const FinancialsCard = ({ project, onClick }: FinancialsCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card 
      className="p-6 bg-gradient-to-br from-slate-700 to-slate-800 text-white cursor-pointer hover:from-slate-600 hover:to-slate-700 transition-all"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        Financials
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Project Value</span>
          <span className="font-bold text-lg">{formatCurrency(project.value)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Profit Margin</span>
          <span className="font-bold text-green-400">{project.profitability}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Status</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            project.status === 'Active' 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-500 text-white'
          }`}>
            {project.status}
          </span>
        </div>
        
        <div className="border-t border-slate-600 pt-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              Open Bills
            </span>
            <span className="font-medium text-red-400">$12,500</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-300 text-sm flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Open Invoices
            </span>
            <span className="font-medium text-green-400">$45,200</span>
          </div>
        </div>

        <div className="border-t border-slate-600 pt-4">
          <p className="text-slate-300 text-sm mb-2">Financial Status</p>
          <div className="p-3 bg-slate-600 rounded-lg">
            <p className="text-sm text-yellow-400">
              Risk of becoming illiquid next month due to outstanding invoices. Recommend accelerating collections process.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
