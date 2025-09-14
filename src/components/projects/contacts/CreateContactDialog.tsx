import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Contact } from "./types";
import { VendorCombobox } from "@/components/common/VendorCombobox";
interface CreateContactDialogProps {
  onSubmit: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}
export const CreateContactDialog = ({
  onSubmit,
  onClose
}: CreateContactDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    vendor_ref: "",
    company_name_override: "",
    sector: "",
    unit: "",
    role: "",
    address: "",
    phones: [""],
    emails: [""]
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contactData = {
      ...formData,
      phones: formData.phones.filter(phone => phone.trim() !== ""),
      emails: formData.emails.filter(email => email.trim() !== "")
    };
    const hasCompany = contactData.vendor_ref || contactData.company_name_override;
    if (contactData.name && hasCompany && contactData.emails.length > 0) {
      onSubmit(contactData);
    }
  };
  const addPhone = () => {
    setFormData({
      ...formData,
      phones: [...formData.phones, ""]
    });
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
    setFormData({
      ...formData,
      phones: newPhones
    });
  };
  const addEmail = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, ""]
    });
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
    setFormData({
      ...formData,
      emails: newEmails
    });
  };
  return <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add New Contact</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={formData.name} onChange={e => setFormData({
            ...formData,
            name: e.target.value
          })} required />
          </div>
          <div>
            <Label htmlFor="vendor">Vendor/Company *</Label>
            <VendorCombobox
              value={formData.company}
              onChange={(value) => setFormData({
                ...formData,
                company: value,
                vendor_ref: value ? value : "",
                company_name_override: value ? "" : formData.company_name_override
              })}
              placeholder="Select or type vendor name..."
            />
          </div>
        </div>

        {!formData.vendor_ref && (
          <div>
            <Label htmlFor="company_name_override">Company Name Override</Label>
            <Input 
              id="company_name_override" 
              value={formData.company_name_override} 
              onChange={e => setFormData({
                ...formData,
                company_name_override: e.target.value,
                company: e.target.value
              })} 
              placeholder="Enter company name if not in vendor list"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="sector">Sector</Label>
            <Input id="sector" value={formData.sector} onChange={e => setFormData({
            ...formData,
            sector: e.target.value
          })} />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" value={formData.unit} onChange={e => setFormData({
            ...formData,
            unit: e.target.value
          })} />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={formData.role} onChange={e => setFormData({
            ...formData,
            role: e.target.value
          })} />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea id="address" value={formData.address} onChange={e => setFormData({
          ...formData,
          address: e.target.value
        })} rows={2} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Phone Numbers</Label>
            <Button type="button" variant="outline" size="sm" onClick={addPhone}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          {formData.phones.map((phone, index) => <div key={index} className="flex items-center space-x-2 mb-2">
              <Input value={phone} onChange={e => updatePhone(index, e.target.value)} placeholder="Enter phone number" />
              {formData.phones.length > 1 && <Button type="button" variant="outline" size="sm" onClick={() => removePhone(index)}>
                  <X className="w-4 h-4" />
                </Button>}
            </div>)}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Email Addresses *</Label>
            <Button type="button" variant="outline" size="sm" onClick={addEmail}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          {formData.emails.map((email, index) => <div key={index} className="flex items-center space-x-2 mb-2">
              <Input type="email" value={email} onChange={e => updateEmail(index, e.target.value)} placeholder="Enter email address" required={index === 0} />
              {formData.emails.length > 1 && <Button type="button" variant="outline" size="sm" onClick={() => removeEmail(index)}>
                  <X className="w-4 h-4" />
                </Button>}
            </div>)}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-[#0a1f44]">
            Create Contact
          </Button>
        </div>
      </form>
    </DialogContent>;
};