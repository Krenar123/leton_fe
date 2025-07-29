import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ContactsTable } from "./contacts/ContactsTable";
import { ContactsFilters } from "./contacts/ContactsFilters";
import { CreateContactDialog } from "./contacts/CreateContactDialog";
import { EditContactDialog } from "./contacts/EditContactDialog";
import { Contact, ContactFilters, ContactSortField, ContactSortDirection } from "./contacts/types";
import { Dialog } from "@/components/ui/dialog";
interface ContactsDialogProps {
  projectName: string;
  onClose: () => void;
}
interface ColumnVisibility {
  name: boolean;
  company: boolean;
  sector: boolean;
  unit: boolean;
  role: boolean;
  address: boolean;
  phone: boolean;
  email: boolean;
}

// Mock data
const mockContacts: Contact[] = [{
  id: 1,
  name: "John Smith",
  company: "ABC Corp",
  sector: "Technology",
  unit: "Engineering",
  role: "Project Manager",
  address: "123 Main St, New York, NY",
  phones: ["+1-555-0123", "+1-555-0124"],
  emails: ["john.smith@abccorp.com", "j.smith@personal.com"],
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-20T15:30:00Z"
}, {
  id: 2,
  name: "Sarah Johnson",
  company: "XYZ Holdings",
  sector: "Finance",
  unit: "Accounting",
  role: "Financial Analyst",
  address: "456 Oak Ave, Los Angeles, CA",
  phones: ["+1-555-0125"],
  emails: ["sarah.johnson@xyzholdings.com"],
  createdAt: "2024-01-18T09:00:00Z",
  updatedAt: "2024-01-18T09:00:00Z"
}];
export const ContactsDialog = ({
  projectName,
  onClose
}: ContactsDialogProps) => {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ContactFilters>({
    company: "",
    sector: "",
    unit: "",
    role: ""
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    company: true,
    sector: true,
    unit: true,
    role: true,
    address: true,
    phone: true,
    email: true
  });
  const [sortField, setSortField] = useState<ContactSortField>('name');
  const [sortDirection, setSortDirection] = useState<ContactSortDirection>('asc');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const hasActiveFilters = filters.company || filters.sector || filters.unit || filters.role;
  const clearFilters = () => {
    setFilters({
      company: "",
      sector: "",
      unit: "",
      role: ""
    });
  };
  const filteredAndSortedContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters = (!filters.company || contact.company.toLowerCase().includes(filters.company.toLowerCase())) && (!filters.sector || contact.sector?.toLowerCase().includes(filters.sector.toLowerCase())) && (!filters.unit || contact.unit?.toLowerCase().includes(filters.unit.toLowerCase())) && (!filters.role || contact.role?.toLowerCase().includes(filters.role.toLowerCase()));
    return matchesSearch && matchesFilters;
  }).sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
  const handleSort = (field: ContactSortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleCreateContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Math.max(...contacts.map(c => c.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContacts([...contacts, newContact]);
    setIsCreateDialogOpen(false);
  };
  const handleEditContact = (contactData: Contact) => {
    setContacts(contacts.map(c => c.id === contactData.id ? {
      ...contactData,
      updatedAt: new Date().toISOString()
    } : c));
    setIsEditDialogOpen(false);
    setSelectedContact(null);
  };
  const handleDeleteContact = (contactId: number) => {
    setContacts(contacts.filter(c => c.id !== contactId));
  };
  const handleCopyContact = (contact: Contact) => {
    const copiedContact: Contact = {
      ...contact,
      id: Math.max(...contacts.map(c => c.id)) + 1,
      name: `${contact.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContacts([...contacts, copiedContact]);
  };
  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditDialogOpen(true);
  };
  return <>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Contacts - {projectName}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Search and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input placeholder="Search contacts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              
              {/* Filter Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="p-2">
                    <Filter className={`h-4 w-4 ${hasActiveFilters ? 'text-yellow-600' : ''}`} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        Clear All
                      </Button>
                    </div>
                    <ContactsFilters filters={filters} onFiltersChange={setFilters} contacts={contacts} />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Customize Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="p-2">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="space-y-4">
                    <h4 className="font-medium">Customize Columns</h4>
                    <div className="space-y-3">
                      {Object.entries(columnVisibility).map(([key, visible]) => <div key={key} className="flex items-center space-x-2">
                          <Checkbox id={key} checked={visible} onCheckedChange={checked => setColumnVisibility({
                        ...columnVisibility,
                        [key]: checked as boolean
                      })} />
                          <label htmlFor={key} className="text-sm capitalize">
                            {key}
                          </label>
                        </div>)}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#0a1f44]">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>

          {/* Contacts Table */}
          <div className="flex-1 min-h-0">
            <ContactsTable contacts={filteredAndSortedContacts} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} onEditClick={handleEditClick} onDeleteClick={handleDeleteContact} onCopyClick={handleCopyContact} columnVisibility={columnVisibility} />
          </div>
        </div>
      </DialogContent>

      {/* Dialogs */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <CreateContactDialog onSubmit={handleCreateContact} onClose={() => setIsCreateDialogOpen(false)} />
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {selectedContact && <EditContactDialog contact={selectedContact} onSubmit={handleEditContact} onClose={() => setIsEditDialogOpen(false)} />}
      </Dialog>
    </>;
};