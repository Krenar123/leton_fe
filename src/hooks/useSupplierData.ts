import { useQuery } from "@tanstack/react-query";
import {
  fetchSupplierByRef,
  fetchSupplierProjects,
  fetchSupplierInvoices,
  fetchSupplierBills,
  fetchSupplierMeetings
} from "@/services/api";

import { Supplier } from "@/types/supplier";

export const useSupplierData = (supplierRef: string) => {
  const {
    data: supplierData,
    isLoading: supplierLoading,
    isError: supplierError
  } = useQuery({
    queryKey: ["supplier", supplierRef],
    queryFn: () => fetchSupplierByRef(supplierRef),
    enabled: !!supplierRef
  });

  const {
    data: projectData,
    isLoading: projectLoading,
    isError: projectError
  } = useQuery({
    queryKey: ["supplier-projects", supplierRef],
    queryFn: () => fetchSupplierProjects(supplierRef),
    enabled: !!supplierRef
  });

  const {
    data: invoiceData,
    isLoading: invoiceLoading,
    isError: invoiceError
  } = useQuery({
    queryKey: ["supplier-invoices", supplierRef],
    queryFn: () => fetchSupplierInvoices(supplierRef),
    enabled: !!supplierRef
  });

  const {
    data: billData,
    isLoading: billLoading,
    isError: billError
  } = useQuery({
    queryKey: ["supplier-bills", supplierRef],
    queryFn: () => fetchSupplierBills(supplierRef),
    enabled: !!supplierRef
  });

  const {
    data: meetingData,
    isLoading: meetingLoading,
    isError: meetingError
  } = useQuery({
    queryKey: ["supplier-meetings", supplierRef],
    queryFn: () => fetchSupplierMeetings(supplierRef),
    enabled: !!supplierRef
  });

  const supplier: Supplier | null = supplierData?.data?.attributes || null;
  const projects = projectData?.data?.map((d: any) => d.attributes) || [];
  const invoices = invoiceData?.data?.map((d: any) => d.attributes) || [];
  const bills = billData?.data?.map((d: any) => d.attributes) || [];
  const meetings = meetingData?.data?.map((d: any) => d.attributes) || [];

  const handleSupplierUpdate = (updatedSupplier: Supplier) => {
    console.log("Supplier updated:", updatedSupplier);
  };

  return {
    supplier,
    projects,
    invoices,
    bills,
    meetings,
    isLoading:
      supplierLoading || projectLoading || invoiceLoading || billLoading || meetingLoading,
    isError:
      supplierError || projectError || invoiceError || billError || meetingError,
    handleSupplierUpdate
  };
};
