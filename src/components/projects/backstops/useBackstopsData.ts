
import { useState } from "react";
import { Backstop, AddBackstopData } from "./types";

const initialMockBackstops: Backstop[] = [
  {
    id: 1,
    what: "Task Due Date",
    where: "Phase 1 - Foundation",
    backstopValue: "2025-08-15",
    status: "On Track",
    type: "task_due",
    isReached: false,
    severity: "medium",
    dateCreated: "2025-07-15",
    isAutomatic: true
  },
  {
    id: 2,
    what: "Item Line Cost",
    where: "Electrical Installation",
    backstopValue: "$3,500",
    status: "$3,200 (91%)",
    currentValue: "$3,200",
    type: "item_expense",
    isReached: false,
    severity: "medium",
    dateCreated: "2025-07-20",
    isAutomatic: false
  },
  {
    id: 3,
    what: "Project Profitability",
    where: "Overall Project",
    backstopValue: "15%",
    status: "18.5%",
    currentValue: "18.5%",
    type: "job_profitability",
    isReached: false,
    severity: "low",
    dateCreated: "2025-07-25",
    isAutomatic: false
  },
  {
    id: 4,
    what: "Projected Cash Flow",
    where: "September 2025",
    backstopValue: "50%",
    status: "65%",
    currentValue: "65%",
    type: "cashflow",
    isReached: true,
    severity: "high",
    dateCreated: "2025-07-30",
    isAutomatic: false
  }
];

export const useBackstopsData = () => {
  const [backstops, setBackstops] = useState<Backstop[]>(initialMockBackstops);

  const getWhatFromField = (field: string, type: string) => {
    if (field === "item_line") return "Item Line Cost";
    if (field === "project_profit") return "Project Profitability";
    if (field === "projected_cashflow") return "Projected Cash Flow";
    return "Custom Backstop";
  };

  const getWhereFromField = (field: string) => {
    if (field === "project_profit") return "Overall Project";
    if (field === "projected_cashflow") return "Project Cash Flow";
    return "Project";
  };

  const formatThreshold = (threshold: number, type: string) => {
    if (type === "outflow_ratio" || type === "profitability") return `${threshold}%`;
    return `$${threshold.toLocaleString()}`;
  };

  const getBackstopType = (field: string): Backstop["type"] => {
    if (field === "item_line") return "item_expense";
    if (field === "project_profit") return "job_profitability";
    if (field === "projected_cashflow") return "cashflow";
    return "individual";
  };

  const handleAddBackstop = (backstopData: AddBackstopData) => {
    const newBackstop: Backstop = {
      id: Math.max(...backstops.map(b => b.id)) + 1,
      what: getWhatFromField(backstopData.field, backstopData.type),
      where: backstopData.itemLine || getWhereFromField(backstopData.field),
      backstopValue: formatThreshold(backstopData.threshold, backstopData.type),
      status: "Monitoring",
      type: getBackstopType(backstopData.field),
      isReached: false,
      severity: "medium",
      dateCreated: new Date().toISOString().split('T')[0],
      isAutomatic: false
    };

    setBackstops([...backstops, newBackstop]);
  };

  const handleDeleteBackstop = (id: number) => {
    const backstop = backstops.find(b => b.id === id);
    if (backstop?.isAutomatic) {
      return;
    }
    setBackstops(backstops.filter(b => b.id !== id));
  };

  const totalBackstops = backstops.length;
  const reachedBackstops = backstops.filter(b => b.isReached).length;

  return {
    backstops,
    totalBackstops,
    reachedBackstops,
    handleAddBackstop,
    handleDeleteBackstop
  };
};
