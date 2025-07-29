
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GenerateReportDialog } from "./GenerateReportDialog";
import { ReportViewerDialog } from "./ReportViewerDialog";
import { ReportsHeader } from "./ReportsHeader";
import { ReportTable } from "./ReportTable";
import { useReportsData } from "./useReportsData";
import { Report } from "./types";

export const ReportsPage = () => {
  const {
    reports,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    columnVisibility,
    setColumnVisibility,
    sortField,
    sortDirection,
    hasActiveFilters,
    clearFilters,
    filteredAndSortedReports,
    handleSort,
    handleGenerateReport,
    handleDeleteReport,
    mockProjects
  } = useReportsData();

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleDownloadReport = (report: Report) => {
    console.log('Download report:', report);
  };

  const handlePrintReport = (report: Report) => {
    console.log('Print report:', report);
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
  };

  return (
    <div className="space-y-6 px-[16px] py-[16px]">
      <Card className="p-6">
        <ReportsHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onGenerateReport={() => setIsGenerateDialogOpen(true)}
          filterContent={<div>Filter content placeholder</div>}
          settingsContent={<div>Settings content placeholder</div>}
        />

        <ReportTable
          reports={filteredAndSortedReports}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onViewClick={handleViewReport}
          onDownloadClick={handleDownloadReport}
          onPrintClick={handlePrintReport}
          onDeleteClick={handleDeleteReport}
          onReportClick={handleReportClick}
          columnVisibility={columnVisibility}
        />
      </Card>

      <GenerateReportDialog
        isOpen={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
        onGenerate={handleGenerateReport}
        projects={mockProjects}
      />

      <ReportViewerDialog
        report={selectedReport}
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};
