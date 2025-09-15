// src/hooks/useTeamMemberData.ts
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserByRef,
  fetchUserObjectives,
  fetchUserTasks,
  fetchUserMeetings,
  fetchUserWagePayments,
  fetchUserNotes,
  updateUser,
} from "@/services/api";

export const useTeamMemberData = (userRef: string) => {
  const { data: userRaw, isLoading: lUser } = useQuery({
    queryKey: ["user", userRef],
    queryFn: () => fetchUserByRef(userRef),
    enabled: !!userRef,
  });

  const { data: objRaw, isLoading: lObj } = useQuery({
    queryKey: ["userObjectives", userRef],
    queryFn: () => fetchUserObjectives(userRef),
    enabled: !!userRef,
  });

  const { data: tasksRaw, isLoading: lTasks } = useQuery({
    queryKey: ["userTasks", userRef],
    queryFn: () => fetchUserTasks(userRef),
    enabled: !!userRef,
  });

  const { data: meetingsRaw, isLoading: lMeet } = useQuery({
    queryKey: ["userMeetings", userRef],
    queryFn: () => fetchUserMeetings(userRef),
    enabled: !!userRef,
  });

  const { data: wagesRaw, isLoading: lWages } = useQuery({
    queryKey: ["userWages", userRef],
    queryFn: () => fetchUserWagePayments(userRef),
    enabled: !!userRef,
  });

  const { data: notesRaw, isLoading: lNotes } = useQuery({
    queryKey: ["userNotes", userRef],
    queryFn: () => fetchUserNotes(userRef),
    enabled: !!userRef,
  });

  // flatten JSON:API
  const user = useMemo(() => {
    const d = userRaw?.data;
    if (!d) return null;
    const a = d.attributes || {};
    return {
      ref: d.id,
      name: a.fullName,
      email: a.email,
      phone: a.phone || "",
      address: a.address || "",
      position: a.position || "",
      department: a.department || "",
      avatar: a.avatarUrl || "",
      companyName: a.companyName || "",
      role: a.role,
    };
  }, [userRaw]);

  const objectives = useMemo(() => {
    const arr = Array.isArray(objRaw?.data) ? objRaw.data : [];
    const items = arr.map((e: any) => {
      const a = e.attributes || {};
      return {
        id: e.id,
        title: a.title,
        description: a.description,
        status: a.status,
        priority: a.priority,
        startDate: a.startDate,
        endDate: a.endDate,
      };
    });
    return {
      total: items.length,
      completed: items.filter(o => o.status === "completed").length,
      items,
    };
  }, [objRaw]);

  const tasks = useMemo(() => {
    const arr = Array.isArray(tasksRaw?.data) ? tasksRaw.data : [];
    const items = arr.map((e: any) => {
      const a = e.attributes || {};
      return {
        id: e.id,
        title: a.title,
        description: a.description,
        status: a.status,
        priority: a.priority,
        start_date: a.startDate,
        due_date: a.dueDate,
      };
    });
    return {
      total: items.length,
      completed: items.filter(t => t.status === "completed").length,
      items,
    };
  }, [tasksRaw]);

  const meetings = useMemo(() => {
    const arr = Array.isArray(meetingsRaw?.data) ? meetingsRaw.data : [];
    return arr.map((e: any) => {
      const a = e.attributes || {};
      // map to your TeamMemberMeetings shape
      const meetingDate = a.meeting_date ?? a.meetingDate ?? "";
      return {
        id: e.id,
        person: a.organizerName || "", // or other field you prefer
        date: meetingDate,
        time: meetingDate ? new Date(meetingDate).toISOString().slice(11,16) : "",
        title: a.title,
        location: a.location,
        status: a.status,
      };
    }).sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [meetingsRaw]);

  const wagePayments = useMemo(() => {
    const arr = Array.isArray(wagesRaw?.data) ? wagesRaw.data : [];
    return arr.map((e: any) => {
      const a = e.attributes || {};
      return {
        id: e.id,
        date: a.workDate,
        hoursWorked: Number(a.hoursWorked || 0),
        hourlyRate: Number(a.hourlyRate || 0),
        totalCost: Number(a.totalCost || 0),
        description: a.description || "",
      };
    });
  }, [wagesRaw]);

  const notes = useMemo(() => {
    const arr = Array.isArray(notesRaw?.data) ? notesRaw.data : [];
    return arr.map((e: any) => {
      const a = e.attributes || {};
      return {
        id: e.id,
        title: a.title,
        content: a.content,
        type: a.noteType,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };
    });
  }, [notesRaw]);

  return {
    isLoading: lUser || lObj || lTasks || lMeet || lWages || lNotes,
    user,
    objectives,
    tasks,
    meetings,
    wagePayments,
    notes,
    updateUser: (payload: any) => updateUser(userRef, payload),
  };
};
