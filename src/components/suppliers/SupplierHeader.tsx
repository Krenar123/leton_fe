import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Pen, FileText, Calendar, MoreHorizontal } from "lucide-react";
import { Supplier } from "@/types/supplier";
interface SupplierHeaderProps {
  supplier: Supplier;
  isSupplierDialogOpen: boolean;
  setIsSupplierDialogOpen: (open: boolean) => void;
  onSupplierUpdate: (supplier: Supplier) => void;
  onNotesClick: () => void;
  onDocumentsClick: () => void;
  onMeetingsClick: () => void;
}
export const SupplierHeader = ({
  supplier,
  setIsSupplierDialogOpen,
  onNotesClick,
  onDocumentsClick,
  onMeetingsClick
}: SupplierHeaderProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate total contract value from projects
  const totalContractValue = supplier.currentProjects * 50000 + supplier.totalProjects * 25000; // Example calculation

  return <Card className="p-8 bg-white border border-border py-[24px] px-[24px] mx-[16px] my-[16px]">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {/* Company Information Column - Made wider */}
        <div className="lg:col-span-3">
          {/* Supplier Information Card - Clickable */}
          <Card className="p-6 bg-slate-800 text-white rounded-lg cursor-pointer transition-all hover:bg-slate-700 relative group h-full" onClick={() => setIsSupplierDialogOpen(true)}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-xl font-semibold mb-3">{supplier.company}</h1>
                <p className="text-slate-300 mb-2">Contact Person: {supplier.name}</p>
                <p className="text-slate-300">Total Value of Contracts: {formatCurrency(totalContractValue)}</p>
              </div>
              
              {/* Three lines indicator - dashboard style */}
              <div className="flex items-center justify-center w-8 h-8">
                <MoreHorizontal className="w-5 h-5 text-white rotate-90" />
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons - Stacked vertically */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          {/* Notes Button */}
          <Card onClick={onNotesClick} className="flex-1 p-4 bg-gradient-to-br from-sky-50 to-sky-100 text-slate-900 cursor-pointer hover:from-sky-100 hover:to-sky-200 transition-all flex flex-col items-center justify-center relative">
            <Pen className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Notes</span>
          </Card>

          {/* Documents Button */}
          <Card onClick={onDocumentsClick} className="flex-1 p-4 bg-gradient-to-br from-sky-50 to-sky-100 text-slate-900 cursor-pointer hover:from-sky-100 hover:to-sky-200 transition-all flex flex-col items-center justify-center relative">
            <FileText className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Documents</span>
          </Card>
        </div>

        {/* Meetings Card - Dashboard Style - Made wider */}
        <Card onClick={onMeetingsClick} className="p-6 bg-gradient-to-br from-sky-50 to-sky-100 text-slate-900 cursor-pointer hover:from-sky-100 hover:to-sky-200 transition-all relative lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Next Meetings
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="font-medium text-sm text-slate-900">
              With: John Smith
            </div>
            <div className="text-sm text-slate-600">
              2025-07-12 at 14:00
            </div>
          </div>

          <MoreHorizontal className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer" style={{
          color: '#0a1f44'
        }} />
        </Card>
      </div>
    </Card>;
};