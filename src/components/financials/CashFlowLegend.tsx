
export const CashFlowLegend = () => {
  return (
    <div className="flex items-center gap-6 text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span>Income</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <span>Expenses</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-1 bg-slate-600"></div>
        <span>Historic (Solid lines)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-0.5 bg-slate-400 border-dashed border-t-2"></div>
        <span>Projected (Dashed lines)</span>
      </div>
    </div>
  );
};
