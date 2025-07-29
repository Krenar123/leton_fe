
import { ReactNode } from "react";

interface SupplierDetailsLayoutProps {
  children: ReactNode;
}

export const SupplierDetailsLayout = ({
  children
}: SupplierDetailsLayoutProps) => {
  return (
    <div className="p-6 space-y-6 min-h-screen px-0 py-0 bg-background">
      {children}
    </div>
  );
};
