import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
  client: string;
  location: string;
  start: string;
  due: string;
  value: number;
  profitability: number;
  status: "Active" | "Completed";
  description?: string;
}

interface ColumnVisibility {
  client: boolean;
  location: boolean;
  start: boolean;
  due: boolean;
  value: boolean;
  profit: boolean;
}

interface ProjectTableProps {
  projects: Project[];
  columnVisibility: ColumnVisibility;
}

const ProjectTable = ({ projects, columnVisibility }: ProjectTableProps) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">Project Name</TableHead>
            {columnVisibility.client && <TableHead className="font-semibold">Client</TableHead>}
            {columnVisibility.location && <TableHead className="font-semibold">Location</TableHead>}
            {columnVisibility.start && <TableHead className="font-semibold">Start</TableHead>}
            {columnVisibility.due && <TableHead className="font-semibold">Due</TableHead>}
            {columnVisibility.value && <TableHead className="font-semibold">Value</TableHead>}
            {columnVisibility.profit && <TableHead className="font-semibold">Profit %</TableHead>}
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow 
              key={project.id} 
              className="hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <TableCell 
                className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                {project.name}
              </TableCell>
              {columnVisibility.client && <TableCell>{project.client}</TableCell>}
              {columnVisibility.location && <TableCell>{project.location}</TableCell>}
              {columnVisibility.start && <TableCell>{formatDate(project.start)}</TableCell>}
              {columnVisibility.due && <TableCell>{formatDate(project.due)}</TableCell>}
              {columnVisibility.value && <TableCell className="font-medium">{formatCurrency(project.value)}</TableCell>}
              {columnVisibility.profit && (
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
              )}
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'Active' 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {project.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;
