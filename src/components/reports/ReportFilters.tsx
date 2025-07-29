
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportFilters, Report } from "./types";

interface ReportFiltersComponentProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  reports: Report[];
}

export const ReportFiltersComponent = ({
  filters,
  onFiltersChange,
  reports
}: ReportFiltersComponentProps) => {
  const updateFilter = (key: keyof ReportFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Get unique values for filter options
  const uniqueProjects = [...new Set(reports.map(r => r.projectName))];
  const uniqueClients = [...new Set(reports.map(r => r.client))];
  const uniqueCreators = [...new Set(reports.map(r => r.createdBy))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Project</Label>
        <Select value={filters.projectName} onValueChange={(value) => updateFilter('projectName', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All projects</SelectItem>
            {uniqueProjects.map((project) => (
              <SelectItem key={project} value={project}>
                {project}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Client</Label>
        <Select value={filters.client} onValueChange={(value) => updateFilter('client', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All clients</SelectItem>
            {uniqueClients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Format</Label>
        <Select value={filters.format} onValueChange={(value) => updateFilter('format', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All formats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All formats</SelectItem>
            <SelectItem value="PDF">PDF</SelectItem>
            <SelectItem value="Excel">Excel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Created By</Label>
        <Select value={filters.createdBy} onValueChange={(value) => updateFilter('createdBy', value)}>
          <SelectTrigger>
            <SelectValue placeholder="All creators" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All creators</SelectItem>
            {uniqueCreators.map((creator) => (
              <SelectItem key={creator} value={creator}>
                {creator}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
