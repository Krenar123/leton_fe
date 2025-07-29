
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X } from "lucide-react";
import { Report } from "./types";

interface ReportViewerDialogProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportViewerDialog = ({ report, isOpen, onClose }: ReportViewerDialogProps) => {
  if (!report) return null;

  const handleDownload = () => {
    console.log('Downloading report:', report.name);
    // Implementation for downloading the PDF
  };

  const handlePrint = () => {
    console.log('Printing report:', report.name);
    // Implementation for printing the PDF
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <DialogTitle className="text-lg font-semibold">{report.name}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {report.projectName} • {report.client}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 border rounded-lg bg-white overflow-hidden">
          {/* PDF Viewer Container */}
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Financial Report</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {report.format} report for {report.projectName}
                </p>
                <div className="mt-4 text-xs text-gray-400 space-y-1">
                  <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                  <p>Last Updated: {new Date(report.lastRun).toLocaleDateString()}</p>
                  <p>Format: {report.format}</p>
                  <div className="mt-2">
                    <p className="font-medium">Included Sections:</p>
                    <ul className="list-disc list-inside text-left max-w-xs mx-auto">
                      {report.includedSections.estimatesVsActuals && <li>Estimates vs Actuals</li>}
                      {report.includedSections.invoicedVsPaid && <li>Invoiced vs Paid</li>}
                      {report.includedSections.billsVsPayments && <li>Bills vs Payments</li>}
                      {report.includedSections.cashFlowGraph && <li>Cash Flow Graph</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
