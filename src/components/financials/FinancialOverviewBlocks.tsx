import { Card } from "@/components/ui/card";
import { EstimateActualItem, ViewMode } from "@/types/financials";

interface FinancialOverviewBlocksProps {
  estimatesActualsData: EstimateActualItem[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const FinancialOverviewBlocks = ({
  estimatesActualsData,
  viewMode,
  onViewModeChange,
}: FinancialOverviewBlocksProps) => {
  const calculateTotals = () => {
    return estimatesActualsData.reduce(
      (acc, item) => {
        acc.estimatedCost += item.estimatedCost;
        acc.actualCost += item.actualCost || 0;
        acc.estimatedRevenue += item.estimatedRevenue;
        acc.actualRevenue += item.actualRevenue || 0;
        acc.invoiced += item.invoiced;
        acc.paid += item.paid;
        acc.billed += item.billed;
        acc.payments += item.payments;
        return acc;
      },
      {
        estimatedCost: 0,
        actualCost: 0,
        estimatedRevenue: 0,
        actualRevenue: 0,
        invoiced: 0,
        paid: 0,
        billed: 0,
        payments: 0,
      }
    );
  };

  const totals = calculateTotals();

  // Mock team cost data - this would come from a separate data source
  const teamCostTotals = {
    totalTeamCost: 85000
  };

  const blocks = [
    {
      id: 'contract-amounts' as ViewMode,
      title: 'Contract Amounts',
      items: [
        { label: 'Original', value: totals.estimatedRevenue },
        { label: 'Revised', value: totals.actualRevenue }
      ],
      type: 'contract'
    },
    {
      id: 'invoiced-paid' as ViewMode,
      title: 'Invoicing & Payments',
      items: [
        { label: 'Invoiced', value: totals.invoiced },
        { label: 'Paid', value: totals.paid }
      ],
      type: 'invoice'
    },
    {
      id: 'cost-tracking' as ViewMode,
      title: 'Cost Tracking',
      items: [
        { label: 'Estimated', value: totals.estimatedCost },
        { label: 'Actual', value: totals.billed },
        { label: 'Paid', value: totals.payments }
      ],
      type: 'cost'
    },
    {
      id: 'team-cost' as ViewMode,
      title: 'Team Cost',
      items: [
        { label: 'Team Cost', value: teamCostTotals.totalTeamCost }
      ],
      type: 'team'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatValue = (value: number, label: string) => {
    if (label === 'Team Members') {
      return value.toString();
    }
    return formatCurrency(value);
  };

  const getBlockStyles = (block: any, isSelected: boolean) => {
    const baseClasses = "cursor-pointer transition-all duration-200 rounded-xl overflow-hidden";
    
    let backgroundClasses = "";
    let textClasses = "";
    let valueTextClasses = "";
    
    switch (block.type) {
      case 'contract':
        backgroundClasses = isSelected 
          ? "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800" 
          : "bg-slate-800";
        textClasses = "text-white";
        valueTextClasses = "text-green-400";
        break;
      case 'invoice':
        backgroundClasses = isSelected 
          ? "bg-gradient-to-br from-slate-500 via-slate-400 to-slate-500" 
          : "bg-slate-600";
        textClasses = "text-white";
        valueTextClasses = "text-green-400";
        break;
      case 'cost':
        backgroundClasses = isSelected 
          ? "bg-gradient-to-br from-blue-200 via-blue-100 to-blue-200" 
          : "bg-blue-200";
        textClasses = "text-slate-800";
        valueTextClasses = "text-red-600";
        break;
      case 'team':
        backgroundClasses = isSelected 
          ? "bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100" 
          : "bg-blue-100";
        textClasses = "text-slate-800";
        valueTextClasses = "text-red-600";
        break;
    }
    
    const colSpan = block.type === 'team' ? 'col-span-2' : 'col-span-3';
    
    return {
      containerClasses: `${baseClasses} ${backgroundClasses} ${colSpan}`,
      textClasses,
      valueTextClasses
    };
  };

  return (
    <div className="grid grid-cols-11 gap-6">
      {blocks.map((block) => {
        const isSelected = viewMode === block.id;
        const styles = getBlockStyles(block, isSelected);
        
        return (
          <div
            key={block.id}
            className={styles.containerClasses}
            onClick={() => onViewModeChange(block.id)}
          >
            <div className="p-4">
              {/* Title */}
              <div className={`text-xs font-medium mb-3 text-center ${styles.textClasses}`}>
                {block.title}
              </div>

              {/* Values in a single line */}
              <div className="flex items-center justify-between gap-2">
                {block.items.map((item, index) => (
                  <div key={index} className="flex-1 text-center">
                    {block.type !== 'team' && (
                      <div className={`text-xs font-medium mb-1 ${styles.textClasses}`}>
                        {item.label}
                      </div>
                    )}
                    <div className={`text-sm font-bold ${styles.valueTextClasses}`}>
                      {formatValue(item.value, item.label)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
