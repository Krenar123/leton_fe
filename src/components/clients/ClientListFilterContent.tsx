
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ClientListFilterContentProps {
  activeTab: string;
}

export const ClientListFilterContent = ({ activeTab }: ClientListFilterContentProps) => {
  const getFilterContent = () => {
    return (
      <div className="space-y-4">
        <div className="text-sm font-medium">Filter Options</div>
        <div className="space-y-3">
          {activeTab === 'projects' && (
            <>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Location</Label>
                <Input placeholder="Filter by location" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Start Date Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="From" type="date" />
                  <Input placeholder="To" type="date" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Due Date Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="From" type="date" />
                  <Input placeholder="To" type="date" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Value Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Profit % Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Min %" type="number" />
                  <Input placeholder="Max %" type="number" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Status</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="active" />
                    <Label htmlFor="active" className="text-sm">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="completed" />
                    <Label htmlFor="completed" className="text-sm">Completed</Label>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'bills' && (
            <>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Billed Value Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Payments Value Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Outstanding Value Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Due Date Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="From" type="date" />
                  <Input placeholder="To" type="date" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Start Date Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="From" type="date" />
                  <Input placeholder="To" type="date" />
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Status</Label>
                <div className="space-y-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="inProgress" />
                    <Label htmlFor="inProgress" className="text-sm">In Progress</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="complete" />
                    <Label htmlFor="complete" className="text-sm">Complete</Label>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'meetings' && (
            <>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Our Persons</Label>
                <Input placeholder="Filter by our persons" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Description</Label>
                <Input placeholder="Filter by description" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Location</Label>
                <Input placeholder="Filter by location" className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide">Date Range</Label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="From" type="date" />
                  <Input placeholder="To" type="date" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return getFilterContent();
};
