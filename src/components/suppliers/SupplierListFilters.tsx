
import { ListHeader } from "@/components/common/ListHeader";

interface SupplierListFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  currentColumns: any;
  onColumnVisibilityChange: (column: string, value: boolean) => void;
}

export const SupplierListFilters = ({
  searchTerm,
  onSearchChange,
  activeTab,
  currentColumns,
  onColumnVisibilityChange
}: SupplierListFiltersProps) => {
  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case 'projects':
        return 'Search projects...';
      case 'bills':
        return 'Search invoices...';
      case 'meetings':
        return 'Search meetings...';
      default:
        return 'Search...';
    }
  };

  const getColumnOptions = () => {
    switch (activeTab) {
      case 'projects':
        return [
          { key: 'location', label: 'Location' },
          { key: 'start', label: 'Start Date' },
          { key: 'due', label: 'Due Date' },
          { key: 'value', label: 'Value' },
          { key: 'profitability', label: 'Profitability' },
          { key: 'status', label: 'Status' }
        ];
      case 'bills':
        return [
          { key: 'invoiced', label: 'Invoiced' },
          { key: 'payments', label: 'Payments' },
          { key: 'outstanding', label: 'Outstanding' },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'status', label: 'Status' }
        ];
      case 'meetings':
        return [
          { key: 'ourPersons', label: 'Our Persons' },
          { key: 'project', label: 'Project' },
          { key: 'location', label: 'Location' },
          { key: 'date', label: 'Date' },
          { key: 'time', label: 'Time' }
        ];
      default:
        return [];
    }
  };

  const getFilterContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <div className="space-y-4">
            <div className="text-sm font-medium">Project Filters</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Location</label>
                <input type="text" placeholder="Enter location" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Value Range</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 border rounded-md text-sm" />
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Date Range</label>
                <div className="flex gap-2 mt-1">
                  <input type="date" className="w-full px-3 py-2 border rounded-md text-sm" />
                  <input type="date" className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'bills':
        return (
          <div className="space-y-4">
            <div className="text-sm font-medium">Invoice Filters</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Status</label>
                <select className="w-full mt-1 px-3 py-2 border rounded-md text-sm">
                  <option value="">All Statuses</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Project</label>
                <input type="text" placeholder="Enter project name" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Amount Range</label>
                <div className="flex gap-2 mt-1">
                  <input type="number" placeholder="Min" className="w-full px-3 py-2 border rounded-md text-sm" />
                  <input type="number" placeholder="Max" className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Date Range</label>
                <div className="flex gap-2 mt-1">
                  <input type="date" className="w-full px-3 py-2 border rounded-md text-sm" />
                  <input type="date" className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'meetings':
        return (
          <div className="space-y-4">
            <div className="text-sm font-medium">Meeting Filters</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Project</label>
                <input type="text" placeholder="Enter project name" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Location</label>
                <input type="text" placeholder="Enter location" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500">Date Range</label>
                <div className="flex gap-2 mt-1">
                  <input type="date" className="w-full px-3 py-2 border rounded-md text-sm" />
                  <input type="date" className="w-full px-3 py-2 border rounded-md text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500">Our Persons</label>
                <input type="text" placeholder="Enter person name" className="w-full mt-1 px-3 py-2 border rounded-md text-sm" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const settingsContent = (
    <div className="space-y-4">
      <div className="text-sm font-medium">Column Visibility</div>
      <div className="space-y-2">
        {getColumnOptions().map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={key}
              checked={currentColumns[key] || false}
              onChange={(e) => onColumnVisibilityChange(key, e.target.checked)}
              className="rounded"
            />
            <label htmlFor={key} className="text-sm">{label}</label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ListHeader
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder={getSearchPlaceholder()}
      filterContent={getFilterContent()}
      settingsContent={settingsContent}
    />
  );
};
