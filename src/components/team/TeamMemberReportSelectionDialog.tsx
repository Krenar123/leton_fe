
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBarChart, Download, Calendar, Users, DollarSign, TrendingUp } from "lucide-react";

interface TeamMemberReportSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
}

const availableReports = [
  {
    id: 'working-hours',
    title: 'Working Hours Report',
    description: 'Detailed breakdown of hours worked by project and time period',
    icon: Calendar,
    color: 'text-blue-600'
  },
  {
    id: 'project-summary',
    title: 'Project Summary Report',
    description: 'Summary of all projects worked on with task completion rates',
    icon: FileBarChart,
    color: 'text-green-600'
  },
  {
    id: 'wage-statement',
    title: 'Wage Statement',
    description: 'Earnings, payment details, and financial summary',
    icon: DollarSign,
    color: 'text-yellow-600'
  },
  {
    id: 'performance',
    title: 'Performance Report',
    description: 'Tasks completed, objectives achieved, and performance metrics',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
];

export const TeamMemberReportSelectionDialog = ({ 
  isOpen, 
  onOpenChange, 
  memberName 
}: TeamMemberReportSelectionDialogProps) => {
  const handleReportSelect = (reportId: string) => {
    console.log(`Selected report: ${reportId} for ${memberName}`);
    // Here you would typically navigate to the report generation or open a specific report dialog
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900 text-xl flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            Reports - {memberName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Select a report type to generate for {memberName}:
          </p>
          
          <div className="grid gap-3">
            {availableReports.map((report) => {
              const IconComponent = report.icon;
              return (
                <Card 
                  key={report.id}
                  className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                  onClick={() => handleReportSelect(report.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gray-50 ${report.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {report.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReportSelect(report.id);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
