
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { ChevronDown, ChevronUp, MoreHorizontal, Edit, Trash, Copy } from "lucide-react";
import { Contact, ContactSortField, ContactSortDirection } from "./types";
import { ContactPhoneDialog } from "./ContactPhoneDialog";
import { ContactEmailDialog } from "./ContactEmailDialog";

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

interface ContactsTableProps {
  contacts: Contact[];
  sortField: ContactSortField;
  sortDirection: ContactSortDirection;
  onSort: (field: ContactSortField) => void;
  onEditClick: (contact: Contact) => void;
  onDeleteClick: (contactId: number) => void;
  onCopyClick: (contact: Contact) => void;
  columnVisibility: ColumnVisibility;
}

export const ContactsTable = ({
  contacts,
  sortField,
  sortDirection,
  onSort,
  onEditClick,
  onDeleteClick,
  onCopyClick,
  columnVisibility
}: ContactsTableProps) => {
  const [phoneDialogContact, setPhoneDialogContact] = useState<Contact | null>(null);
  const [emailDialogContact, setEmailDialogContact] = useState<Contact | null>(null);

  const SortableHeader = ({ field, children }: { field: ContactSortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none py-2"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium">{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? 
            <ChevronUp className="w-3 h-3" /> : 
            <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </TableHead>
  );

  const handlePhoneClick = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact.phones.length === 1) {
      window.open(`tel:${contact.phones[0]}`, '_self');
    } else {
      setPhoneDialogContact(contact);
    }
  };

  const handleEmailClick = (contact: Contact, e: React.MouseEvent) => {
    e.stopPropagation();
    if (contact.emails.length === 1) {
      window.open(`mailto:${contact.emails[0]}`, '_self');
    } else {
      setEmailDialogContact(contact);
    }
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="hover:bg-gray-50">
              {columnVisibility.name && <SortableHeader field="name">Name</SortableHeader>}
              {columnVisibility.company && <SortableHeader field="company">Company</SortableHeader>}
              {columnVisibility.sector && <SortableHeader field="sector">Sector</SortableHeader>}
              {columnVisibility.unit && <SortableHeader field="unit">Unit</SortableHeader>}
              {columnVisibility.role && <SortableHeader field="role">Role</SortableHeader>}
              {columnVisibility.address && (
                <TableHead className="py-2">
                  <span className="text-xs font-medium">Address</span>
                </TableHead>
              )}
              {columnVisibility.phone && (
                <TableHead className="py-2">
                  <span className="text-xs font-medium">Phone</span>
                </TableHead>
              )}
              {columnVisibility.email && (
                <TableHead className="py-2">
                  <span className="text-xs font-medium">Email</span>
                </TableHead>
              )}
              <TableHead className="w-12 py-2"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow 
                key={contact.id} 
                className="hover:bg-gray-50 h-12"
              >
                {columnVisibility.name && (
                  <TableCell className="py-2">
                    <span className="text-sm font-medium">{contact.name}</span>
                  </TableCell>
                )}
                {columnVisibility.company && (
                  <TableCell className="py-2">
                    <span className="text-sm">{contact.company}</span>
                  </TableCell>
                )}
                {columnVisibility.sector && (
                  <TableCell className="py-2">
                    <span className="text-sm text-gray-600">{contact.sector || '-'}</span>
                  </TableCell>
                )}
                {columnVisibility.unit && (
                  <TableCell className="py-2">
                    <span className="text-sm text-gray-600">{contact.unit || '-'}</span>
                  </TableCell>
                )}
                {columnVisibility.role && (
                  <TableCell className="py-2">
                    <span className="text-sm text-gray-600">{contact.role || '-'}</span>
                  </TableCell>
                )}
                {columnVisibility.address && (
                  <TableCell className="py-2">
                    <span className="text-sm text-gray-600 max-w-32 truncate block">
                      {contact.address || '-'}
                    </span>
                  </TableCell>
                )}
                {columnVisibility.phone && (
                  <TableCell className="py-2">
                    {contact.phones.length > 0 && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={(e) => handlePhoneClick(contact, e)}
                        className="h-auto p-0 text-xs text-blue-600 hover:underline"
                      >
                        {contact.phones.length === 1 ? contact.phones[0] : "Multiple"}
                      </Button>
                    )}
                  </TableCell>
                )}
                {columnVisibility.email && (
                  <TableCell className="py-2">
                    {contact.emails.length > 0 && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={(e) => handleEmailClick(contact, e)}
                        className="h-auto p-0 text-xs text-blue-600 hover:underline"
                      >
                        {contact.emails.length === 1 ? contact.emails[0] : "Multiple"}
                      </Button>
                    )}
                  </TableCell>
                )}
                <TableCell className="py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onEditClick(contact)}>
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCopyClick(contact)}>
                        <Copy className="w-3 h-3 mr-2" />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDeleteClick(contact.id)}
                        className="text-red-600"
                      >
                        <Trash className="w-3 h-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Phone Dialog */}
      <Dialog open={!!phoneDialogContact} onOpenChange={() => setPhoneDialogContact(null)}>
        {phoneDialogContact && (
          <ContactPhoneDialog 
            contact={phoneDialogContact}
            onClose={() => setPhoneDialogContact(null)}
          />
        )}
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={!!emailDialogContact} onOpenChange={() => setEmailDialogContact(null)}>
        {emailDialogContact && (
          <ContactEmailDialog 
            contact={emailDialogContact}
            onClose={() => setEmailDialogContact(null)}
          />
        )}
      </Dialog>
    </>
  );
};
