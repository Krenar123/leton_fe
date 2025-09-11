import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjectMeetings,
  createProjectMeeting,
  updateProjectMeeting,
  deleteProjectMeeting,
} from "@/services/api";
import { Meeting } from "@/types/project";

export const useProjectMeetings = (projectRef: string) => {
  const qc = useQueryClient();

  const qKey = ["projectMeetings", projectRef];

  const meetingsQ = useQuery({
    queryKey: qKey,
    queryFn: () => fetchProjectMeetings(projectRef),
    enabled: !!projectRef,
    select: (resp) => {
      // Expect JSON:API-ish or flat; normalize to Meeting type
      const arr = Array.isArray(resp?.data) ? resp.data : (Array.isArray(resp) ? resp : []);
      
      return arr.map((e: any): Meeting => {
        const a = e.attributes ?? e; // if not JSON:API

        return {
          id: e.id ?? a.ref ?? a.id ?? "",
          ref: e.ref ?? a.ref ?? e.id ?? "",
          title: a.title ?? "Untitled",
          start_at: a.start_at ?? a.startAt ?? "",
          end_at: a.end_at ?? a.endAt ?? "",
          location: a.location ?? "",
          agenda: a.agenda ?? "",
          notes: a.notes ?? "",
          client_ref: a.client_ref ?? a.clientRef ?? "",
          client_attendees_text: a.client_attendees_text ?? a.clientAttendeesText ?? "",
          attendee_user_refs: a.attendee_user_refs ?? a.attendeeUserRefs ?? [],
          created_at: a.created_at ?? a.createdAt ?? "",
          updated_at: a.updated_at ?? a.updatedAt ?? "",
        };
      });
    },
  });

  const createM = useMutation({
    mutationFn: (payload: any) => createProjectMeeting(projectRef, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qKey }),
  });

  const updateM = useMutation({
    mutationFn: ({ meetingRef, payload }: { meetingRef: string; payload: any }) =>
      updateProjectMeeting(projectRef, meetingRef, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qKey }),
  });

  const deleteM = useMutation({
    mutationFn: (meetingRef: string) => deleteProjectMeeting(projectRef, meetingRef),
    onSuccess: () => qc.invalidateQueries({ queryKey: qKey }),
  });

  return {
    ...meetingsQ,
    createMeeting: createM.mutateAsync,
    updateMeeting: updateM.mutateAsync,
    deleteMeeting: deleteM.mutateAsync,
  };
};
