// src/hooks/useTeamData.ts
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, fetchUsersWithFilters } from "@/services/api";


export type UIMember = {
  id: string;           // <-- user ref
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;       // initials
};

export const useTeamData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users", { q: searchTerm, department: departmentFilter }],
    queryFn: () => fetchUsersWithFilters(searchTerm, departmentFilter),
  });

  console.log(data);

  // All members mapped from JSON:API
  const members: UIMember[] = useMemo(() => {
    const arr = Array.isArray(data?.data) ? data.data : [];
    return arr.map((e: any) => {
      const a = e.attributes || {};
      const name = a.fullName || "";
      return {
        id: String(e.id), // serializer set_id :ref => this is the user ref
        name,
        position: a.position || "",
        department: a.department || "",
        email: a.email || "",
        phone: a.phone || "",
        address: a.address || "",
        avatar: name.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
      };
    });
  }, [data]);

  // Unique departments (client-side derived)
  const departments = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => m.department && set.add(m.department));
    return Array.from(set);
  }, [members]);


  console.log(members);


  // Keep your page’s prop name: filteredMembers
  const filteredMembers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return members.filter(m => {
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.position.toLowerCase().includes(q);
      const matchesDept =
        departmentFilter === "all" || m.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [members, searchTerm, departmentFilter]);

  // Create member (requires backend to allow creating a user)
  const { mutateAsync: addMemberMut } = useMutation({
    mutationFn: (payload: {
      full_name: string;
      email: string;
      position?: string;
      department?: string;
      phone?: string;
      address?: string;
      // password?: string; // only if your backend needs it and you allow client-side creation
    }) => createUser(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });

  const addMember = async (input: {
    name: string; position: string; department: string;
    email: string; phone: string; address: string;
  }) => {
    await addMemberMut({
      full_name: input.name,
      email:     input.email,
      position:  input.position,
      department:input.department,
      phone:     input.phone,
      address:   input.address,
      // password: "Temp1234!" // if needed
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDepartmentFilter("all");
  };

  const hasActiveFilters = searchTerm !== "" || departmentFilter !== "all";

  return {
    isLoading,
    searchTerm, setSearchTerm,
    departmentFilter, setDepartmentFilter,
    departments,
    filteredMembers,
    clearFilters,
    hasActiveFilters,
    addMember,
  };
};
