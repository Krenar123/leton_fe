
import { Button } from "@/components/ui/button";
import { CashFlowPeriod, CashFlowRange } from "@/types/financials";

interface CashFlowControlsProps {
  period: CashFlowPeriod;
  range: CashFlowRange;
  onPeriodChange: (period: CashFlowPeriod) => void;
  onRangeChange: (range: CashFlowRange) => void;
}

export const CashFlowControls = ({ 
  period, 
  range, 
  onPeriodChange, 
  onRangeChange 
}: CashFlowControlsProps) => {
  return (
    <div className="flex gap-2">
      {/* Period Toggle */}
      <div className="flex border border-blue-300 rounded-lg overflow-hidden">
        <Button
          variant={period === 'weekly' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange('weekly')}
          className="rounded-none"
        >
          Weekly
        </Button>
        <Button
          variant={period === 'monthly' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange('monthly')}
          className="rounded-none"
        >
          Monthly
        </Button>
      </div>

      {/* Range Toggle */}
      <div className="flex border border-blue-300 rounded-lg overflow-hidden">
        <Button
          variant={range === 'current' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onRangeChange('current')}
          className="rounded-none text-xs"
        >
          Current
        </Button>
        <Button
          variant={range === 'last2' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onRangeChange('last2')}
          className="rounded-none text-xs"
        >
          Last 2Q
        </Button>
        <Button
          variant={range === 'last3' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onRangeChange('last3')}
          className="rounded-none text-xs"
        >
          Last 3Q
        </Button>
        <Button
          variant={range === 'last4' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onRangeChange('last4')}
          className="rounded-none text-xs"
        >
          Last 4Q
        </Button>
      </div>
    </div>
  );
};
