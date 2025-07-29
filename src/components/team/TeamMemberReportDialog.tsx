import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Download, FileBarChart } from "lucide-react";
import { useState } from "react";

interface TeamMemberReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
}

const reportTypes = [
  { id: 'working-hours', label: 'Working Hours Report', description: 'Detailed breakdown of hours worked by project' },
  { id: 'project-summary', label: 'Project Summary Report', description: 'Summary of all projects worked on' },
  { id: 'wage-statement', label: 'Wage Statement', description: 'Earnings and payment details' },
  { id: 'performance', label: 'Performance Report', description: 'Tasks, objectives, and achievements' }
];

const projects = [
  'Downtown Office Complex',
  'Residential Tower',
  'Shopping Mall Renovation',
  'Bridge Construction Project',
  'Hospital Extension'
];

export const TeamMemberReportDialog = ({ 
  isOpen, 
  onOpenChange, 
  memberName 
}: TeamMemberReportDialogProps) => {
  const [selectedReportType, setSelectedReportType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [includeDetails, setIncludeDetails] = useState(true);

  const handleProjectToggle = (project: string) => {
    setSelectedProjects(prev => 
      prev.includes(project) 
        ? prev.filter(p => p !== project)
        : [...prev, project]
    );
  };

  const handleGenerateReport = () => {
    if (!selectedReportType || !dateFrom || !dateTo) {
      return;
    }
    
    console.log("Generating report:", {
      type: selectedReportType,
      member: memberName,
      dateRange: { from: dateFrom, to: dateTo },
      projects: selectedProjects,
      includeDetails
    });
    
    // Here you would typically generate the report
    onOpenChange(false);
  };

  const isFormValid = selectedReportType && dateFrom && dateTo;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-navy-900/95 backdrop-blur-md border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            Create Report - {memberName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Report Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportTypes.map((type) => (
                <div key={type.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={type.id}
                    checked={selectedReportType === type.id}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedReportType(type.id);
                    }}
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor={type.id}
                      className="text-white font-medium cursor-pointer"
                    >
                      {type.label}
                    </label>
                    <p className="text-white/60 text-sm">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Date Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">From Date</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">To Date</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Selection */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Projects (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-white/60 text-sm">Select specific projects to include in the report, or leave blank for all projects.</p>
              {projects.map((project) => (
                <div key={project} className="flex items-center space-x-2">
                  <Checkbox
                    id={project}
                    checked={selectedProjects.includes(project)}
                    onCheckedChange={() => handleProjectToggle(project)}
                  />
                  <label
                    htmlFor={project}
                    className="text-white cursor-pointer"
                  >
                    {project}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-details"
                  checked={includeDetails}
                  onCheckedChange={(checked) => setIncludeDetails(!!checked)}
                />
                <label
                  htmlFor="include-details"
                  className="text-white cursor-pointer"
                >
                  Include detailed breakdown
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerateReport}
              disabled={!isFormValid}
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-white disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};