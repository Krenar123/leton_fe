import { useQuery } from "@tanstack/react-query";
import { Project } from "@/types/project";
import { Objective } from "@/types/objective";
import {
  fetchProjectById,
  fetchObjectivesByProject,
  fetchProjectMeetings,
  fetchProjectDocuments,
  fetchProjectNotes,
  fetchProjectContacts
} from "@/services/api";

export const useProjectData = (projectRef: string) => {
  const {
    data: projectData,
    isLoading: projectLoading,
    isError: projectError
  } = useQuery({
    queryKey: ["project", projectRef],
    queryFn: () => fetchProjectById(projectRef),
    enabled: !!projectRef
  });

  const {
    data: objectiveData,
    isLoading: objectiveLoading,
    isError: objectiveError
  } = useQuery({
    queryKey: ["objectives", projectRef],
    queryFn: () => fetchObjectivesByProject(projectRef),
    enabled: !!projectRef
  });

  const {
    data: meetingsData,
    isLoading: meetingsLoading,
    isError: meetingsError
  } = useQuery({
    queryKey: ["projectMeetings", projectRef],
    queryFn: () => fetchProjectMeetings(projectRef),
    enabled: !!projectRef
  });

  const {
    data: documentsData,
    isLoading: documentsLoading,
    isError: documentsError
  } = useQuery({
    queryKey: ["projectDocuments", projectRef],
    queryFn: () => fetchProjectDocuments(projectRef),
    enabled: !!projectRef
  });

  const {
    data: notesData,
    isLoading: notesLoading,
    isError: notesError
  } = useQuery({
    queryKey: ["projectNotes", projectRef],
    queryFn: () => fetchProjectNotes(projectRef),
    enabled: !!projectRef
  });

  const {
    data: contactsData,
    isLoading: contactsLoading,
    isError: contactsError
  } = useQuery({
    queryKey: ["projectContacts", projectRef],
    queryFn: () => fetchProjectContacts(projectRef),
    enabled: !!projectRef
  });

  const project: Project | null = projectData?.data?.attributes || null;

  console.log("project");
  console.log(project);
  const actionItems: Objective[] = Array.isArray(objectiveData?.data)
    ? objectiveData.data.map((entry: any) => ({
        ...entry.attributes,
        ref: entry.id
      }))
    : [];

  // Process meetings data
  const meetings = Array.isArray(meetingsData?.data) 
    ? meetingsData.data.map((entry: any) => {
        const a = entry.attributes ?? entry;
        
        // Handle date mapping from database schema
        const meetingDate = a.meeting_date ?? a.meetingDate ?? "";
        const durationMinutes = a.duration_minutes ?? a.durationMinutes ?? 60;
        
        let start_at = "";
        let end_at = "";
        
        if (meetingDate) {
          const startDate = new Date(meetingDate);
          const endDate = new Date(startDate.getTime() + (durationMinutes * 60 * 1000));
          start_at = startDate.toISOString();
          end_at = endDate.toISOString();
        }

        return {
          ...a,
          id: entry.id,
          ref: entry.id,
          start_at: a.start_at ?? a.startAt ?? start_at,
          end_at: a.end_at ?? a.endAt ?? end_at,
        };
      })
    : [];

  // Process documents data
  const documents = Array.isArray(documentsData) 
    ? documentsData.map((doc: any) => ({
        id: doc.id,
        name: doc.name || doc.filename,
        size: doc.size,
        created_at: doc.created_at || doc.uploaded_at,
        updated_at: doc.updated_at || doc.created_at || doc.uploaded_at,
        file_type: doc.file_type || doc.name?.split('.').pop()?.toLowerCase(),
        is_new: doc.is_new || false
      }))
    : [];

  // Process notes data
  const notes = Array.isArray(notesData?.data) 
    ? notesData.data.map((entry: any) => ({
        ...entry.attributes,
        id: entry.id,
        ref: entry.id,
        created_at: entry.attributes?.created_at || entry.created_at,
        updated_at: entry.attributes?.updated_at || entry.updated_at
      }))
    : [];

  // Process contacts data
  const contacts = Array.isArray(contactsData?.data) 
    ? contactsData.data.map((entry: any) => ({
        ...entry.attributes,
        id: entry.id,
        ref: entry.id
      }))
    : [];

  const handleProjectUpdate = (updatedProject: Project) => {
    const changeNote = {
      timestamp: new Date().toISOString(),
      changes: `Project updated: ${updatedProject.name}`,
      details: updatedProject
    };

    console.log("Project updated:", changeNote);
  };

  return {
    project,
    actionItems,
    meetings,
    documents,
    notes,
    contacts,
    isLoading: projectLoading || objectiveLoading || meetingsLoading || documentsLoading || notesLoading || contactsLoading,
    isError: projectError || objectiveError || meetingsError || documentsError || notesError || contactsError,
    handleProjectUpdate
  };
};
