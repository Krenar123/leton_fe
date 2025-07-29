
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Project, GenerateReportFormData } from "./types";

interface GenerateReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: GenerateReportFormData) => void;
  projects: Project[];
}

export const GenerateReportDialog = ({
  isOpen,
  onClose,
  onGenerate,
  projects
}: GenerateReportDialogProps) => {
  const [formData, setFormData] = useState<GenerateReportFormData>({
    projectId: 0,
    reportName: "",
    format: "PDF",
    includedSections: {
      estimatesVsActuals: true,
      invoicedVsPaid: true,
      billsVsPayments: true,
      cashFlowGraph: true,
    }
  });

  const selectedProject = projects.find(p => p.id === formData.projectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.projectId && formData.reportName.trim()) {
      onGenerate(formData);
      onClose();
      setFormData({
        projectId: 0,
        reportName: "",
        format: "PDF",
        includedSections: {
          estimatesVsActuals: true,
          invoicedVsPaid: true,
          billsVsPayments: true,
          cashFlowGraph: true,
        }
      });
    }
  };

  const updateIncludedSection = (section: keyof typeof formData.includedSections, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      includedSections: {
        ...prev.includedSections,
        [section]: checked
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Financial Report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project *</Label>
              <Select
                value={formData.projectId.toString()}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  projectId: parseInt(value),
                  reportName: prev.reportName || `${projects.find(p => p.id === parseInt(value))?.name} Financial Report`
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name} - {project.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select
                value={formData.format}
                onValueChange={(value: "PDF" | "Excel") => setFormData(prev => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reportName">Report Name *</Label>
            <Input
              id="reportName"
              value={formData.reportName}
              onChange={(e) => setFormData(prev => ({ ...prev, reportName: e.target.value }))}
              placeholder="Enter report name"
            />
          </div>

          {selectedProject && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Project Information (Always Included)</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div><strong>Client:</strong> {selectedProject.client}</div>
                <div><strong>Contact:</strong> {selectedProject.contact}</div>
                <div><strong>Start Date:</strong> {new Date(selectedProject.startDate).toLocaleDateString()}</div>
                <div><strong>Due Date:</strong> {new Date(selectedProject.dueDate).toLocaleDateString()}</div>
                <div><strong>Project Value:</strong> ${selectedProject.value.toLocaleString()}</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label>Financial Sections to Include</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="estimatesVsActuals"
                  checked={formData.includedSections.estimatesVsActuals}
                  onCheckedChange={(checked) => updateIncludedSection('estimatesVsActuals', Boolean(checked))}
                />
                <Label htmlFor="estimatesVsActuals" className="text-sm">
                  Estimates vs Actuals List
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="invoicedVsPaid"
                  checked={formData.includedSections.invoicedVsPaid}
                  onCheckedChange={(checked) => updateIncludedSection('invoicedVsPaid', Boolean(checked))}
                />
                <Label htmlFor="invoicedVsPaid" className="text-sm">
                  Invoiced vs Paid List
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="billsVsPayments"
                  checked={formData.includedSections.billsVsPayments}
                  onCheckedChange={(checked) => updateIncludedSection('billsVsPayments', Boolean(checked))}
                />
                <Label htmlFor="billsVsPayments" className="text-sm">
                  Bills vs Payments List
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cashFlowGraph"
                  checked={formData.includedSections.cashFlowGraph}
                  onCheckedChange={(checked) => updateIncludedSection('cashFlowGraph', Boolean(checked))}
                />
                <Label htmlFor="cashFlowGraph" className="text-sm">
                  Cash Flow Graph
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.projectId || !formData.reportName.trim()}
            >
              Generate Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
