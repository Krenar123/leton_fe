
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <UserCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-900 mb-2">No team members found</h3>
      <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
};
