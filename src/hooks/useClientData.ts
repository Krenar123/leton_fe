import { useQuery } from "@tanstack/react-query";
import {
  fetchClientByRef,
  fetchClientProjects,
  fetchClientBills,
  fetchClientMeetings
} from "@/services/api";

export const useClientData = (clientRef: string) => {
  const {
    data: client,
    isLoading: isLoadingClient,
    refetch: refetchClient,
  } = useQuery({
    queryKey: ["client", clientRef],
    queryFn: () => fetchClientByRef(clientRef),
    enabled: !!clientRef
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["clientProjects", clientRef],
    queryFn: () => fetchClientProjects(clientRef),
    enabled: !!clientRef
  });

  const { data: bills = [], isLoading: isLoadingBills } = useQuery({
    queryKey: ["clientBills", clientRef],
    queryFn: () => fetchClientBills(clientRef),
    enabled: !!clientRef
  });

  const { data: meetings = [], isLoading: isLoadingMeetings } = useQuery({
    queryKey: ["clientMeetings", clientRef],
    queryFn: () => fetchClientMeetings(clientRef),
    enabled: !!clientRef
  });

  const handleClientUpdate = (updatedClient: any) => {
    console.log("Client updated:", updatedClient);
    refetchClient();
  };

  return {
    client,
    projects,
    bills,
    meetings,
    isLoading:
      isLoadingClient ||
      isLoadingProjects ||
      isLoadingBills ||
      isLoadingMeetings,
    handleClientUpdate
  };
};
