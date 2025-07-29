
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContactFilters, Contact } from "./types";

interface ContactsFiltersProps {
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
  contacts: Contact[];
}

export const ContactsFilters = ({ filters, onFiltersChange, contacts }: ContactsFiltersProps) => {
  // Get unique values for each filter, excluding empty/undefined values
  const uniqueCompanies = [...new Set(contacts.map(c => c.company).filter(Boolean))];
  const uniqueSectors = [...new Set(contacts.map(c => c.sector).filter(Boolean))];
  const uniqueUnits = [...new Set(contacts.map(c => c.unit).filter(Boolean))];
  const uniqueRoles = [...new Set(contacts.map(c => c.role).filter(Boolean))];

  const updateFilter = (key: keyof ContactFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? "" : value
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-2 block">Company</label>
        <Select value={filters.company || "all"} onValueChange={(value) => updateFilter("company", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All companies</SelectItem>
            {uniqueCompanies.map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Sector</label>
        <Select value={filters.sector || "all"} onValueChange={(value) => updateFilter("sector", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sectors</SelectItem>
            {uniqueSectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Unit</label>
        <Select value={filters.unit || "all"} onValueChange={(value) => updateFilter("unit", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All units" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All units</SelectItem>
            {uniqueUnits.map((unit) => (
              <SelectItem key={unit} value={unit}>
                {unit}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Role</label>
        <Select value={filters.role || "all"} onValueChange={(value) => updateFilter("role", value)}>
          <SelectTrigger>
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
