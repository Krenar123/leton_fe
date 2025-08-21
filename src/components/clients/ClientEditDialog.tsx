// src/components/clients/ClientEditDialog.tsx
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, X } from "lucide-react";
import { useState } from "react";
import { Client } from "@/types/client";

interface ClientEditDialogProps {
  client: Client; // should expose camelCase fields e.g. contactName
  onClose: () => void;
  onUpdate: (client: {
    company?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    industry?: string;
    status?: string;
  }) => void;
}

interface ContactInfo {
  id: string;
  type: 'email' | 'phone';
  value: string;
}

export const ClientEditDialog = ({ client, onClose, onUpdate }: ClientEditDialogProps) => {
  const [formData, setFormData] = useState({
    company: client.company || "",
    contactName: (client as any).contactName || "",   // was `name` before
    address: client.address || "",
    website: (client as any).website || "",
    industry: (client as any).industry || "",
    status: (client as any).status || "active",
    notes: "" // still local-only; not saved on Client model
  });

  const [contacts, setContacts] = useState<ContactInfo[]>([
    { id: '1', type: 'email', value: client.email || "" },
    { id: '2', type: 'phone', value: client.phone || "" }
  ]);

  const handleSave = () => {
    const primaryEmail = contacts.find(c => c.type === 'email')?.value || '';
    const primaryPhone = contacts.find(c => c.type === 'phone')?.value || '';

    onUpdate({
      company: formData.company,
      contactName: formData.contactName,  // camelCase; hook maps to contact_name
      email: primaryEmail,
      phone: primaryPhone,
      address: formData.address,
      website: formData.website,
      industry: formData.industry,
      status: formData.status,
    });

    onClose();
  };

  const addContact = (type: 'email' | 'phone') => {
    setContacts(prev => [...prev, { id: String(Date.now()), type, value: "" }]);
  };

  const removeContact = (id: string) => {
    setContacts(prev => (prev.length > 1 ? prev.filter(c => c.id !== id) : prev));
  };

  const updateContact = (id: string, value: string) => {
    setContacts(prev => prev.map(c => (c.id === id ? { ...c, value } : c)));
  };

  const handleEmailClick = (email: string) => window.open(`mailto:${email}`, '_self');
  const handlePhoneClick = (phone: string) => window.open(`tel:${phone}`, '_self');

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Client Information</DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="contactName">Contact Person</Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        {/* Address / Website / Industry / Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-gray-700">Contact Information</Label>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" size="sm" onClick={() => addContact('email')}>
                <Mail className="w-4 h-4 mr-1" /> Add Email
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => addContact('phone')}>
                <Phone className="w-4 h-4 mr-1" /> Add Phone
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {contact.type === 'email' ? (
                      <Mail className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Phone className="w-4 h-4 text-gray-500" />
                    )}
                    <Input
                      type={contact.type === 'email' ? 'email' : 'tel'}
                      value={contact.value}
                      onChange={(e) => updateContact(contact.id, e.target.value)}
                      placeholder={contact.type === 'email' ? 'Email address' : 'Phone number'}
                    />
                    {contact.value && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          contact.type === 'email'
                            ? handleEmailClick(contact.value)
                            : handlePhoneClick(contact.value)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Contact
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(contact.id)}
                      disabled={contacts.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes (local only for now) */}
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1"
            rows={3}
            placeholder="Additional notes about this client (not saved on client record)"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  );
};
