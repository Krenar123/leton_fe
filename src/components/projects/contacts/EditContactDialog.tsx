
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Contact } from "./types";

interface EditContactDialogProps {
  contact: Contact;
  onSubmit: (contact: Contact) => void;
  onClose: () => void;
}

export const EditContactDialog = ({ contact, onSubmit, onClose }: EditContactDialogProps) => {
  const [formData, setFormData] = useState({
    name: contact.name,
    company: contact.company,
    sector: contact.sector || "",
    unit: contact.unit || "",
    role: contact.role || "",
    address: contact.address || "",
    phones: contact.phones.length > 0 ? contact.phones : [""],
    emails: contact.emails.length > 0 ? contact.emails : [""]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedContact: Contact = {
      ...contact,
      ...formData,
      phones: formData.phones.filter(phone => phone.trim() !== ""),
      emails: formData.emails.filter(email => email.trim() !== "")
    };

    if (updatedContact.name && updatedContact.company && updatedContact.emails.length > 0) {
      onSubmit(updatedContact);
    }
  };

  const addPhone = () => {
    setFormData({ ...formData, phones: [...formData.phones, ""] });
  };

  const removePhone = (index: number) => {
    setFormData({ 
      ...formData, 
      phones: formData.phones.filter((_, i) => i !== index) 
    });
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...formData.phones];
    newPhones[index] = value;
    setFormData({ ...formData, phones: newPhones });
  };

  const addEmail = () => {
    setFormData({ ...formData, emails: [...formData.emails, ""] });
  };

  const removeEmail = (index: number) => {
    setFormData({ 
      ...formData, 
      emails: formData.emails.filter((_, i) => i !== index) 
    });
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...formData.emails];
    newEmails[index] = value;
    setFormData({ ...formData, emails: newEmails });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Contact</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sector">Sector</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Phone Numbers</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPhone}>
                <Plus className="w-4 h-4 mr-1" />
                Add Phone
              </Button>
            </div>
            <div className="space-y-2">
              {formData.phones.map((phone, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={phone}
                    onChange={(e) => updatePhone(index, e.target.value)}
                    placeholder="Enter phone number"
                  />
                  {formData.phones.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePhone(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Email Addresses *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addEmail}>
                <Plus className="w-4 h-4 mr-1" />
                Add Email
              </Button>
            </div>
            <div className="space-y-2">
              {formData.emails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="Enter email address"
                    required={index === 0}
                  />
                  {formData.emails.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeEmail(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};
