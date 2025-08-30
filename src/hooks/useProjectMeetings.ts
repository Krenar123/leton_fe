import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjectMeetings,
  createProjectMeeting,
  updateProjectMeeting,
  deleteProjectMeeting,
} from "@/services/api";

export const useProjectMeetings = (projectRef: string) => {
  const qc = useQueryClient();

  const qKey = ["projectMeetings", projectRef];

  const meetingsQ = useQuery({
    queryKey: qKey,
    queryFn: () => fetchProjectMeetings(projectRef),
    enabled: !!projectRef,
    select: (resp) => {
      // Expect JSON:API-ish or flat; normalize to your MeetingsDialog shape
      // Map BE -> FE (robust to snake_case/camelCase)
      const arr = Array.isArray(resp?.data) ? resp.data : [];

      console.log("woow");
      console.log(arr);
      
      return arr.map((e: any) => {
        const a = e.attributes ?? e; // if not JSON:API
        // Preferred single datetime from BE (meeting_at) -> split to day/time
        const mAt = a.meeting_at ?? a.meetingAt ?? null;
        const d = mAt ? new Date(mAt) : null;
        const day = a.day ?? (d ? d.toISOString().slice(0, 10) : "");
        const time = a.time ?? (d ? d.toISOString().slice(11, 16) : "");

        return {
          id: e.id ?? a.ref ?? a.id,
          title: a.title ?? a.topic ?? "Untitled",
          withWho: a.with_who ?? a.withWho ?? a.clientName ?? "—",
          ourPerson: a.our_person ?? a.ourPerson ?? a.userName ?? "—",
          day,
          time,
          location: a.location ?? a.link ?? "—",
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
