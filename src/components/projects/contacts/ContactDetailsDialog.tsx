
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, Phone, MapPin, Building, Users, Briefcase } from "lucide-react";
import { Contact } from "./types";

interface ContactDetailsDialogProps {
  contact: Contact;
  onClose: () => void;
  onEdit: () => void;
}

export const ContactDetailsDialog = ({ contact, onClose, onEdit }: ContactDetailsDialogProps) => {
  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <DialogTitle className="text-xl">{contact.name}</DialogTitle>
            {contact.isNew && (
              <Badge variant="default">New</Badge>
            )}
          </div>
          <Button onClick={onEdit} size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {/* Company Information */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{contact.company}</p>
              </div>
            </div>

            {contact.sector && (
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Sector</p>
                  <p className="font-medium">{contact.sector}</p>
                </div>
              </div>
            )}

            {contact.unit && (
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Unit</p>
                  <p className="font-medium">{contact.unit}</p>
                </div>
              </div>
            )}

            {contact.role && (
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{contact.role}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {contact.address && (
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{contact.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-6">
          {/* Phone Numbers */}
          {contact.phones.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-500 font-medium">Phone Numbers</p>
              </div>
              <div className="space-y-2">
                {contact.phones.map((phone, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePhoneClick(phone)}
                    className="w-full justify-start"
                  >
                    {phone}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Email Addresses */}
          {contact.emails.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-500 font-medium">Email Addresses</p>
              </div>
              <div className="space-y-2">
                {contact.emails.map((email, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleEmailClick(email)}
                    className="w-full justify-start"
                  >
                    {email}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamps */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <p>Created: {new Date(contact.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p>Updated: {new Date(contact.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
