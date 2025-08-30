// src/hooks/useSupplierList.ts
import { useQuery } from "@tanstack/react-query";
import { fetchSuppliers } from "@/services/api";

export const useSupplierList = () => {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: () => fetchSuppliers(),
    staleTime: 60_000,
    select: (resp) => {
      const arr = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
      return arr.map((e: any) => {
        const a = e.attributes ?? e;
        return {
          id: e.id ?? a.ref ?? a.id,
          ref: a.ref ?? e.id,
          company: a.company ?? "",
          contact_name: a.contact_name ?? "",
        };
      });
    },
  });
};
