
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Plus, X } from "lucide-react";
import { useState } from "react";
import { Client } from "@/types/client";

interface ClientEditDialogProps {
  client: Client;
  onClose: () => void;
  onUpdate: (client: Client) => void;
}

interface ContactInfo {
  id: string;
  type: 'email' | 'phone';
  value: string;
}

export const ClientEditDialog = ({ client, onClose, onUpdate }: ClientEditDialogProps) => {
  const [formData, setFormData] = useState({
    name: client.name,
    company: client.company,
    address: client.address,
    description: client.description || ""
  });

  const [contacts, setContacts] = useState<ContactInfo[]>([
    { id: '1', type: 'email', value: client.email },
    { id: '2', type: 'phone', value: client.phone }
  ]);

  const handleSave = () => {
    const primaryEmail = contacts.find(c => c.type === 'email')?.value || '';
    const primaryPhone = contacts.find(c => c.type === 'phone')?.value || '';
    
    const updatedClient = {
      ...client,
      ...formData,
      email: primaryEmail,
      phone: primaryPhone
    };
    onUpdate(updatedClient);
    onClose();
  };

  const addContact = (type: 'email' | 'phone') => {
    const newContact: ContactInfo = {
      id: Date.now().toString(),
      type,
      value: ''
    };
    setContacts([...contacts, newContact]);
  };

  const removeContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const updateContact = (id: string, value: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, value } : c));
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

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
            <Label htmlFor="name">Contact Person</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          </div>
        </div>

        {/* Address */}
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

        {/* Contact Information */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-gray-700">Contact Information</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addContact('email')}
              >
                <Mail className="w-4 h-4 mr-1" />
                Add Email
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addContact('phone')}
              >
                <Phone className="w-4 h-4 mr-1" />
                Add Phone
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

        {/* Description */}
        <div>
          <Label htmlFor="description">Notes</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1"
            rows={3}
            placeholder="Additional notes about this client..."
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
