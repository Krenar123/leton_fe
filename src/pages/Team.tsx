
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamFilters } from "@/components/team/TeamFilters";
import { TeamGrid } from "@/components/team/TeamGrid";
import { EmptyState } from "@/components/team/EmptyState";
import { AddMemberDialog } from "@/components/team/AddMemberDialog";
import { useTeamData } from "@/hooks/useTeamData";

const Team = () => {
  const navigate = useNavigate();
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    departments,
    filteredMembers,
    clearFilters,
    hasActiveFilters,
    addMember
  } = useTeamData();

  const handleMemberClick = (memberId: number) => {
    navigate(`/team/${memberId}`);
  };

  const handleAddMember = (memberData: {
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    addMember(memberData);
  };

  return (
    <div className="space-y-6 my-[16px]">
      <TeamFilters 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        departmentFilter={departmentFilter} 
        onDepartmentChange={setDepartmentFilter} 
        departments={departments} 
        onClearFilters={clearFilters} 
        hasActiveFilters={hasActiveFilters}
        onAddMember={() => setIsAddMemberOpen(true)}
      />

      <TeamGrid members={filteredMembers} onMemberClick={handleMemberClick} />

      {filteredMembers.length === 0 && <EmptyState onClearFilters={clearFilters} />}

      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onAddMember={handleAddMember}
        departments={departments}
      />
    </div>
  );
};

export default Team;
