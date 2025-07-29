
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, MoreHorizontal, Eye, Download, Printer, Trash, FileText } from "lucide-react";
import { Report, ReportSortField, ReportSortDirection, ReportColumnVisibility } from "./types";

interface ReportTableProps {
  reports: Report[];
  sortField: ReportSortField;
  sortDirection: ReportSortDirection;
  onSort: (field: ReportSortField) => void;
  onViewClick: (report: Report) => void;
  onDownloadClick: (report: Report) => void;
  onPrintClick: (report: Report) => void;
  onDeleteClick: (reportId: number) => void;
  onReportClick: (report: Report) => void;
  columnVisibility: ReportColumnVisibility;
}

export const ReportTable = ({
  reports,
  sortField,
  sortDirection,
  onSort,
  onViewClick,
  onDownloadClick,
  onPrintClick,
  onDeleteClick,
  onReportClick,
  columnVisibility
}: ReportTableProps) => {
  const SortableHeader = ({ field, children }: { field: ReportSortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none py-2"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium">{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="w-3 h-3" /> : 
            <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </TableHead>
  );

  const getStatusBadge = (status: Report['status']) => {
    const variants = {
      'Active': 'bg-green-100 text-green-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Archived': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={`${variants[status]} border-0`}>
        {status}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getIncludedSectionsText = (sections: Report['includedSections']) => {
    const included = [];
    if (sections.estimatesVsActuals) included.push('Est/Act');
    if (sections.invoicedVsPaid) included.push('Inv/Paid');
    if (sections.billsVsPayments) included.push('Bills/Pay');
    if (sections.cashFlowGraph) included.push('Cash Flow');
    return included.join(', ');
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="hover:bg-gray-50">
            {columnVisibility.name && <SortableHeader field="name">Report Name</SortableHeader>}
            {columnVisibility.projectName && <SortableHeader field="projectName">Project</SortableHeader>}
            {columnVisibility.client && <SortableHeader field="client">Client</SortableHeader>}
            {columnVisibility.createdBy && <SortableHeader field="createdBy">Created By</SortableHeader>}
            {columnVisibility.createdAt && <SortableHeader field="createdAt">Created</SortableHeader>}
            {columnVisibility.lastRun && <SortableHeader field="lastRun">Last Run</SortableHeader>}
            {columnVisibility.status && <SortableHeader field="status">Status</SortableHeader>}
            {columnVisibility.format && (
              <TableHead className="py-2">
                <span className="text-xs font-medium">Format</span>
              </TableHead>
            )}
            {columnVisibility.includedSections && (
              <TableHead className="py-2">
                <span className="text-xs font-medium">Sections</span>
              </TableHead>
            )}
            <TableHead className="w-12 py-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow 
              key={report.id} 
              className="hover:bg-gray-50 h-12 cursor-pointer"
              onClick={() => onReportClick(report)}
            >
              {columnVisibility.name && (
                <TableCell className="py-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">{report.name}</span>
                  </div>
                </TableCell>
              )}
              {columnVisibility.projectName && (
                <TableCell className="py-2">
                  <span className="text-sm text-gray-600">{report.projectName}</span>
                </TableCell>
              )}
              {columnVisibility.client && (
                <TableCell className="py-2">
                  <span className="text-sm text-gray-600">{report.client}</span>
                </TableCell>
              )}
              {columnVisibility.createdBy && (
                <TableCell className="py-2">
                  <span className="text-sm text-gray-600">{report.createdBy}</span>
                </TableCell>
              )}
              {columnVisibility.createdAt && (
                <TableCell className="py-2">
                  <span className="text-sm text-gray-600">{formatDate(report.createdAt)}</span>
                </TableCell>
              )}
              {columnVisibility.lastRun && (
                <TableCell className="py-2">
                  <span className="text-sm text-gray-600">{formatDate(report.lastRun)}</span>
                </TableCell>
              )}
              {columnVisibility.status && (
                <TableCell className="py-2">
                  {getStatusBadge(report.status)}
                </TableCell>
              )}
              {columnVisibility.format && (
                <TableCell className="py-2">
                  <span className="text-sm text-gray-600">{report.format}</span>
                </TableCell>
              )}
              {columnVisibility.includedSections && (
                <TableCell className="py-2">
                  <span className="text-xs text-gray-600">{getIncludedSectionsText(report.includedSections)}</span>
                </TableCell>
              )}
              <TableCell className="py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onViewClick(report);
                    }}>
                      <Eye className="w-3 h-3 mr-2" />
                      View Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onDownloadClick(report);
                    }}>
                      <Download className="w-3 h-3 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onPrintClick(report);
                    }}>
                      <Printer className="w-3 h-3 mr-2" />
                      Print
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(report.id);
                      }}
                      className="text-red-600"
                    >
                      <Trash className="w-3 h-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
