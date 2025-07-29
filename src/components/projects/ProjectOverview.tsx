
import { Card } from "@/components/ui/card";

interface ProjectOverviewProps {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  statusFilter: "all" | "active" | "completed";
  onStatusChange: (status: "all" | "active" | "completed") => void;
}

const ProjectOverview = ({
  totalProjects,
  activeProjects,
  completedProjects,
  statusFilter,
  onStatusChange
}: ProjectOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* All Projects */}
      <Card 
        className={`p-6 cursor-pointer transition-all hover:shadow-md relative ${
          statusFilter === "all" 
            ? 'bg-gradient-to-br from-[#E6ECEF] to-[#D1D8E0] border-l-4 border-l-yellow-500 shadow-md' 
            : 'bg-[#E6ECEF] hover:bg-gray-50 border-l-2 border-l-gray-300'
        }`}
        onClick={() => onStatusChange("all")}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{totalProjects}</div>
          <div className="text-sm text-gray-600">All Projects</div>
        </div>
      </Card>

      {/* Active Projects */}
      <Card 
        className={`p-6 cursor-pointer transition-all hover:shadow-md relative ${
          statusFilter === "active" 
            ? 'bg-gradient-to-br from-[#E6ECEF] to-[#D1D8E0] border-l-4 border-l-yellow-500 shadow-md' 
            : 'bg-[#E6ECEF] hover:bg-gray-50 border-l-2 border-l-gray-300'
        }`}
        onClick={() => onStatusChange("active")}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{activeProjects}</div>
          <div className="text-sm text-gray-600">Active Projects</div>
        </div>
      </Card>
      
      {/* Completed Projects */}
      <Card 
        className={`p-6 cursor-pointer transition-all hover:shadow-md relative ${
          statusFilter === "completed" 
            ? 'bg-gradient-to-br from-[#E6ECEF] to-[#D1D8E0] border-l-4 border-l-yellow-500 shadow-md' 
            : 'bg-[#E6ECEF] hover:bg-gray-50 border-l-2 border-l-gray-300'
        }`}
        onClick={() => onStatusChange("completed")}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">{completedProjects}</div>
          <div className="text-sm text-gray-600">Completed Projects</div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectOverview;
