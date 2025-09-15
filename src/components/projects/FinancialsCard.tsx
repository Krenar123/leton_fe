
import { Card } from "@/components/ui/card";
import { DollarSign, CreditCard, FileText } from "lucide-react";
import { Project } from "@/types/project";

interface FinancialsCardProps {
  project: Project;
  onClick: () => void;
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-500 text-white",
    "on-hold": "bg-yellow-100 text-yellow-800",
    planning: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
};

export const FinancialsCard = ({ project, onClick }: FinancialsCardProps) => {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n || 0);

  // Map the project data to the expected format
  const projectValue = project.budget || 0;
  const projectStatus = project.status || 'planning';

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
          <span className="font-bold text-lg">{fmt(projectValue)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-300">Profit Margin</span>
          <span className="font-bold text-green-400">{project.profitability ?? 0}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-300">Status</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge(projectStatus)}`}>
            {projectStatus.charAt(0).toUpperCase() + projectStatus.slice(1)}
          </span>
        </div>

        <div className="border-t border-slate-600 pt-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm flex items-center">
              <CreditCard className="w-4 h-4 mr-1" />
              Open Bills
            </span>
            <span className="font-medium text-red-400">{fmt(project.openBillsOutstanding)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-300 text-sm flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              Open Invoices
            </span>
            <span className="font-medium text-green-400">{fmt(project.openInvoicesOutstanding)}</span>
          </div>
        </div>

        <div className="border-t border-slate-600 pt-4">
          <p className="text-slate-300 text-sm mb-2">Financial Status</p>
          <div className="p-3 bg-slate-600 rounded-lg">
            <p className="text-sm text-yellow-400">
              {project.openBillsOutstanding > project.openInvoicesOutstanding
                ? "Risk of cash squeeze: payables exceed receivables — consider accelerating collections."
                : "Healthy: receivables cover current payables."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
