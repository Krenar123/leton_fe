
import { CashFlowGraph } from "@/components/financials/CashFlowGraph";
import { useFinancialsData } from "@/hooks/useFinancialsData";

export const CashFlowCard = () => {
  const { documents } = useFinancialsData();

  return <CashFlowGraph documents={documents} />;
};
