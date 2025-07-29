import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { ListHeader } from "@/components/common/ListHeader";

interface JobProfitabilityDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JobProfitabilityDialog = ({ isOpen, onClose }: JobProfitabilityDialogProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [profitabilityFilter, setProfitabilityFilter] = useState("");

  // Mock data for active projects
  const activeProjects = [
    {
      id: 1,
      name: "Office Building Renovation",
      relativeSize: 8.3,
      profitability: 15.5
    },
    {
      id: 2,
      name: "Residential Complex",
      relativeSize: 40.0,
      profitability: 22.3
    },
    {
      id: 4,
      name: "Hospital Wing",
      relativeSize: 31.7,
      profitability: 12.8
    },
    {
      id: 5,
      name: "Shopping Center",
      relativeSize: 20.0,
      profitability: 18.9
    }
  ];

  const filteredProjects = activeProjects.filter(project => {
    const matchesSearch = searchTerm === "" || project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProfitability = profitabilityFilter === "" || 
      (profitabilityFilter === "high" && project.profitability >= 20) ||
      (profitabilityFilter === "medium" && project.profitability >= 15 && project.profitability < 20) ||
      (profitabilityFilter === "low" && project.profitability < 15);
    return matchesSearch && matchesProfitability;
  });

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
    onClose();
  };

  const handleClearFilters = () => {
    setProfitabilityFilter("");
  };

  const hasActiveFilters = profitabilityFilter !== "";

  const filterContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Filter Projects</h4>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} type="button">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div>
        <Label htmlFor="profitability-filter" className="text-gray-700">Profitability Range</Label>
        <Select value={profitabilityFilter} onValueChange={setProfitabilityFilter}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="All ranges" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All ranges</SelectItem>
            <SelectItem value="high">High (≥20%)</SelectItem>
            <SelectItem value="medium">Medium (15-19%)</SelectItem>
            <SelectItem value="low">Low (&lt;15%)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Job Profitability Overview</DialogTitle>
        </DialogHeader>

        <ListHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search projects..."
          filterContent={filterContent}
          hasActiveFilters={hasActiveFilters}
        />
        
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold">Project</TableHead>
                <TableHead className="font-semibold">Relative Project Size %</TableHead>
                <TableHead className="font-semibold">Job Profitability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    No projects found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow 
                    key={project.id} 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <TableCell 
                      className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {project.name}
                    </TableCell>
                    <TableCell className="text-center">{project.relativeSize}%</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        project.profitability >= 20 
                          ? 'bg-green-100 text-green-800'
                          : project.profitability >= 15 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {project.profitability}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
