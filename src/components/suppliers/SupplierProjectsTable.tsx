
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SupplierProject {
  id: number;
  name: string;
  status: string;
  start: string;
  due: string;
  value: number;
  location: string;
  profitability: number;
}

interface SupplierProjectsTableProps {
  projects: SupplierProject[];
  searchTerm: string;
  projectColumns: {
    location: boolean;
    start: boolean;
    due: boolean;
    value: boolean;
    profitability: boolean;
    status: boolean;
  };
}

export const SupplierProjectsTable = ({
  projects,
  searchTerm,
  projectColumns
}: SupplierProjectsTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold text-sm w-[200px]">Project Name</TableHead>
            {projectColumns.location && <TableHead className="font-semibold text-sm w-[150px]">Location</TableHead>}
            {projectColumns.start && <TableHead className="font-semibold text-sm w-[120px]">Start</TableHead>}
            {projectColumns.due && <TableHead className="font-semibold text-sm w-[120px]">Due</TableHead>}
            {projectColumns.value && <TableHead className="font-semibold text-sm w-[120px] text-right">Value</TableHead>}
            {projectColumns.profitability && <TableHead className="font-semibold text-sm w-[100px]">Profit %</TableHead>}
            {projectColumns.status && <TableHead className="font-semibold text-sm w-[120px]">Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects
            .filter(project => 
              project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              project.location.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((project) => (
            <TableRow key={project.id} className="hover:bg-slate-50">
              <TableCell className="font-medium text-blue-600 text-sm">{project.name}</TableCell>
              {projectColumns.location && <TableCell className="text-sm text-gray-600">{project.location}</TableCell>}
              {projectColumns.start && <TableCell className="text-sm text-gray-600">{formatDate(project.start)}</TableCell>}
              {projectColumns.due && <TableCell className="text-sm text-gray-600">{formatDate(project.due)}</TableCell>}
              {projectColumns.value && <TableCell className="text-right font-medium text-sm">{formatCurrency(project.value)}</TableCell>}
              {projectColumns.profitability && (
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
              {projectColumns.status && (
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'Active' 
                      ? 'bg-blue-100 text-blue-800'
                      : project.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
