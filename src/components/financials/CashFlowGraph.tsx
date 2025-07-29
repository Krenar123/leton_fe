
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { FinancialDocument, CashFlowEntry } from "@/types/financials";
import { isAfter, startOfMonth, endOfMonth, format, addMonths } from "date-fns";
import { CashFlowLegend } from "./CashFlowLegend";
import { calculateQuarterlyCashFlowForPeriod } from "@/utils/quarterlyCashFlowCalculations";

interface CashFlowGraphProps {
  documents: FinancialDocument[];
}

export const CashFlowGraph = ({ documents }: CashFlowGraphProps) => {
  const chartData = useMemo(() => {
    const now = new Date();
    const data: CashFlowEntry[] = [];
    
    // Generate monthly data for the current year only
    const currentYear = now.getFullYear();
    const startDate = new Date(currentYear, 0, 1); // January 1st of current year
    
    // Create exactly 12 monthly periods for the current year
    for (let month = 0; month < 12; month++) {
      const monthStart = startOfMonth(addMonths(startDate, month));
      const monthEnd = endOfMonth(monthStart);
      const monthLabel = format(monthStart, 'MMMM');
      
      const isProjected = isAfter(monthStart, now);
      const cashFlows = calculateQuarterlyCashFlowForPeriod(monthStart, monthEnd, documents, now);

      const totalInflow = cashFlows.historicInflow + cashFlows.projectedInflow;
      const totalOutflow = cashFlows.historicOutflow + cashFlows.projectedOutflow;

      data.push({
        date: monthLabel,
        inflow: totalInflow,
        outflow: totalOutflow,
        isProjected: isProjected,
        type: isProjected ? 'projected' : 'actual',
        historicInflow: cashFlows.historicInflow,
        projectedInflow: cashFlows.projectedInflow,
        historicOutflow: cashFlows.historicOutflow,
        projectedOutflow: cashFlows.projectedOutflow
      });
    }

    return data;
  }, [documents]);

  // Split data into historic and projected for separate line rendering
  const historicData = useMemo(() => {
    return chartData.map(entry => ({
      ...entry,
      inflow: entry.isProjected ? null : entry.historicInflow,
      outflow: entry.isProjected ? null : entry.historicOutflow,
    }));
  }, [chartData]);

  const projectedData = useMemo(() => {
    return chartData.map(entry => ({
      ...entry,
      inflow: entry.isProjected ? entry.projectedInflow : null,
      outflow: entry.isProjected ? entry.projectedOutflow : null,
    }));
  }, [chartData]);

  const chartConfig = {
    inflow: {
      label: "Income",
      color: "hsl(142, 76%, 36%)", // Green
    },
    outflow: {
      label: "Expenses", 
      color: "hsl(0, 84%, 60%)", // Red
    },
  };

  return (
    <Card className="p-6 bg-white border-gray-200">
      <div className="space-y-4">
        <div className="h-80 bg-blue-50/30 rounded-lg border border-blue-100/50 p-4">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`,
                    name === 'inflow' ? 'Income' : 'Expenses'
                  ]}
                />
                
                {/* Historic Inflows - Solid Green Line (thick) */}
                <Line
                  type="monotone"
                  dataKey="inflow"
                  data={historicData}
                  stroke={chartConfig.inflow.color}
                  strokeWidth={3}
                  dot={{ r: 4, fill: chartConfig.inflow.color }}
                  connectNulls={false}
                />
                
                {/* Historic Outflows - Solid Red Line (thick) */}
                <Line
                  type="monotone"
                  dataKey="outflow"  
                  data={historicData}
                  stroke={chartConfig.outflow.color}
                  strokeWidth={3}
                  dot={{ r: 4, fill: chartConfig.outflow.color }}
                  connectNulls={false}
                />
                
                {/* Projected Inflows - Dashed Green Line (thin) */}
                <Line
                  type="monotone"
                  dataKey="inflow"
                  data={projectedData}
                  stroke={chartConfig.inflow.color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: chartConfig.inflow.color }}
                  connectNulls={false}
                />
                
                {/* Projected Outflows - Dashed Red Line (thin) */}
                <Line
                  type="monotone"
                  dataKey="outflow"
                  data={projectedData}
                  stroke={chartConfig.outflow.color}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: chartConfig.outflow.color }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <CashFlowLegend />
      </div>
    </Card>
  );
};
