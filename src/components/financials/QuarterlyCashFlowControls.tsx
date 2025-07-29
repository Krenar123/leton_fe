
import { Button } from "@/components/ui/button";

export type QuarterlyPeriod = 'current-year' | 'q1' | 'q2' | 'q3' | 'q4';

interface QuarterlyCashFlowControlsProps {
  period: QuarterlyPeriod;
  onPeriodChange: (period: QuarterlyPeriod) => void;
}

export const QuarterlyCashFlowControls = ({ 
  period, 
  onPeriodChange 
}: QuarterlyCashFlowControlsProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex border border-blue-300 rounded-lg overflow-hidden">
        <Button
          variant={period === 'current-year' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange('current-year')}
          className="rounded-none text-xs"
        >
          Current Year
        </Button>
        <Button
          variant={period === 'q1' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange('q1')}
          className="rounded-none text-xs"
        >
          Q1
        </Button>
        <Button
          variant={period === 'q2' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange('q2')}
          className="rounded-none text-xs"
        >
          Q2
        </Button>
        <Button
          variant={period === 'q3' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange('q3')}
          className="rounded-none text-xs"
        >
          Q3
        </Button>
        <Button
          variant={period === 'q4' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange('q4')}
          className="rounded-none text-xs"
        >
          Q4
        </Button>
      </div>
    </div>
  );
};
