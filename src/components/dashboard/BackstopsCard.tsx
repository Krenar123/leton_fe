import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Menu } from "lucide-react";
import { BackstopsDialog } from "./BackstopsDialog";

export const BackstopsCard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data for backstops summary
  const backstopsData = {
    totalBackstops: 15,
    reachedBackstops: 7,
    reachedTypes: [{
      type: "Due Date",
      count: 3
    }, {
      type: "Costs",
      count: 2
    }, {
      type: "Cash Flow",
      count: 1
    }, {
      type: "Profitability",
      count: 1
    }]
  };

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card onClick={handleCardClick} className="p-6 bg-gradient-to-br from-blue-900 to-blue-950 text-white cursor-pointer hover:from-blue-800 hover:to-blue-900 transition-all py-[38px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Backstops
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-sm text-blue-200">
              <span className="font-medium text-white">
                {backstopsData.reachedBackstops}/{backstopsData.totalBackstops}
              </span>
            </div>
            <Menu className="w-4 h-4 text-white cursor-pointer" />
          </div>
        </div>
        
        <div className="space-y-2">
          {backstopsData.reachedTypes.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-1 border-b border-blue-700 last:border-b-0">
              <div className="text-sm text-blue-100">{item.type}</div>
              <div className="text-sm font-medium text-white">{item.count}</div>
            </div>
          ))}
        </div>
      </Card>

      <BackstopsDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
};
