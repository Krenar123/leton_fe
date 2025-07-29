
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SupplierNotFoundMessageProps {
  onBack: () => void;
}

export const SupplierNotFoundMessage = ({ onBack }: SupplierNotFoundMessageProps) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Vendor Not Found</h2>
        <p className="text-gray-600 mb-4">The vendor you're looking for doesn't exist.</p>
        <Button onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};
