
import { useState, useMemo } from "react";

// Mock team member data
const initialTeamMembers = [
  {
    id: 1,
    name: "John Smith",
    position: "Project Manager",
    department: "Management",
    email: "john.smith@company.com",
    phone: "+1 234 567 8901",
    address: "123 Main St, City, State",
    avatar: "JS"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Senior Engineer",
    department: "Engineering",
    email: "sarah.johnson@company.com",
    phone: "+1 234 567 8902",
    address: "456 Oak Ave, City, State",
    avatar: "SJ"
  },
  {
    id: 3,
    name: "Mike Davis",
    position: "Construction Manager",
    department: "Construction",
    email: "mike.davis@company.com",
    phone: "+1 234 567 8903",
    address: "789 Pine St, City, State",
    avatar: "MD"
  },
  {
    id: 4,
    name: "Lisa Chen",
    position: "Architect",
    department: "Design",
    email: "lisa.chen@company.com",
    phone: "+1 234 567 8904",
    address: "321 Elm St, City, State",
    avatar: "LC"
  },
  {
    id: 5,
    name: "Robert Wilson",
    position: "Site Supervisor",
    department: "Construction",
    email: "robert.wilson@company.com",
    phone: "+1 234 567 8905",
    address: "654 Maple Ave, City, State",
    avatar: "RW"
  },
  {
    id: 6,
    name: "Emily Brown",
    position: "Quality Inspector",
    department: "Quality Assurance",
    email: "emily.brown@company.com",
    phone: "+1 234 567 8906",
    address: "987 Cedar St, City, State",
    avatar: "EB"
  }
];

export const useTeamData = () => {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Get unique departments for filter
  const departments = useMemo(() => 
    Array.from(new Set(teamMembers.map(member => member.department))), 
    [teamMembers]
  );

  // Filter team members
  const filteredMembers = useMemo(() => 
    teamMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = departmentFilter === "all" || member.department === departmentFilter;
      
      return matchesSearch && matchesDepartment;
    }), 
    [teamMembers, searchTerm, departmentFilter]
  );

  const addMember = (memberData: {
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    const newId = Math.max(...teamMembers.map(m => m.id)) + 1;
    const avatar = memberData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const newMember = {
      id: newId,
      ...memberData,
      avatar
    };
    
    setTeamMembers(prev => [...prev, newMember]);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || departmentFilter !== "all";

  return {
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    departments,
    filteredMembers,
    clearFilters,
    hasActiveFilters,
    addMember
  };
};
