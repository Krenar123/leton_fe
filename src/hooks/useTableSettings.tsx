
import { useState } from "react";
import { TableDisplaySettings, FilterStates } from "@/types/financials";

export const useTableSettings = () => {
  const [tableSettings, setTableSettings] = useState<TableDisplaySettings>({
    contractAmounts: {
      showContractor: false,
      showStartDate: false,
      showDueDate: false,
      showDependencies: false,
      showChangeOrders: false,
    },
    invoicedPaid: {
      showContractor: true,
      showBalance: false,
      showStartDate: false,
      showDueDate: false,
      showDependencies: false,
      showChangeOrders: false,
    },
    costsBills: {
      showContractor: true,
      showVendor: false,
      showUnit: false,
      showQuantity: false,
      showUnitPrice: false,
      showBalance: false,
      showStartDate: false,
      showDueDate: false,
      showDependencies: false,
      showChangeOrders: false,
    },
    costTracking: {
      showContractor: true,
      showVendor: false,
      showUnit: false,
      showQuantity: false,
      showUnitPrice: false,
      showBalance: false,
      showStartDate: false,
      showDueDate: false,
      showDependencies: false,
      showChangeOrders: false,
    },
  });

  const [filterStates, setFilterStates] = useState<FilterStates>({
    contractAmounts: {
      searchTerm: "",
      statusFilter: "all",
    },
    invoicedPaid: {
      searchTerm: "",
      statusFilter: "all",
    },
    costsBills: {
      searchTerm: "",
      statusFilter: "all",
    },
    costTracking: {
      searchTerm: "",
      vendorFilter: "all",
    },
  });

  return {
    tableSettings,
    setTableSettings,
    filterStates,
    setFilterStates,
  };
};
