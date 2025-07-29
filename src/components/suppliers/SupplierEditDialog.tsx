
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, X } from "lucide-react";
import { Supplier } from "@/types/supplier";

interface SupplierEditDialogProps {
  supplier: Supplier;
  onClose: () => void;
  onUpdate: (supplier: Supplier) => void;
}

export const SupplierEditDialog = ({
  supplier,
  onClose,
  onUpdate
}: SupplierEditDialogProps) => {
  const [formData, setFormData] = useState({
    company: supplier.company,
    sector: supplier.sector || "",
    address: supplier.address,
    businessNr: supplier.businessNr || "",
    vat: supplier.vat || "",
    name: supplier.name,
    email: supplier.email,
    phone: supplier.phone,
    description: supplier.description || ""
  });

  const [contactItems, setContactItems] = useState([
    { type: 'email', value: supplier.email, id: 1 },
    { type: 'phone', value: supplier.phone, id: 2 }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (id: number, value: string) => {
    setContactItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, value } : item
      )
    );
    
    // Update formData as well
    const contact = contactItems.find(item => item.id === id);
    if (contact) {
      setFormData(prev => ({
        ...prev,
        [contact.type]: value
      }));
    }
  };

  const removeContact = (id: number) => {
    setContactItems(prev => prev.filter(item => item.id !== id));
  };

  const addEmail = () => {
    const newId = Math.max(...contactItems.map(item => item.id), 0) + 1;
    setContactItems(prev => [...prev, { type: 'email', value: '', id: newId }]);
  };

  const addPhone = () => {
    const newId = Math.max(...contactItems.map(item => item.id), 0) + 1;
    setContactItems(prev => [...prev, { type: 'phone', value: '', id: newId }]);
  };

  const handleSave = () => {
    const emailContact = contactItems.find(item => item.type === 'email');
    const phoneContact = contactItems.find(item => item.type === 'phone');

    const updatedSupplier: Supplier = {
      ...supplier,
      company: formData.company,
      sector: formData.sector,
      address: formData.address,
      businessNr: formData.businessNr,
      vat: formData.vat,
      name: formData.name,
      email: emailContact?.value || formData.email,
      phone: phoneContact?.value || formData.phone,
      description: formData.description
    };

    onUpdate(updatedSupplier);
    onClose();
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Supplier Information</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-6 py-4">
        {/* Left Column - Company Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Company Info</h3>
          
          <div>
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sector">Sector</Label>
            <Input
              id="sector"
              value={formData.sector}
              onChange={(e) => handleInputChange('sector', e.target.value)}
              className="mt-1"
              placeholder="e.g., Construction, Manufacturing"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="mt-1 min-h-[80px]"
              placeholder="Enter full address"
            />
          </div>

          <div>
            <Label htmlFor="businessNr">Business Nr.</Label>
            <Input
              id="businessNr"
              value={formData.businessNr}
              onChange={(e) => handleInputChange('businessNr', e.target.value)}
              className="mt-1"
              placeholder="Business registration number"
            />
          </div>

          <div>
            <Label htmlFor="vat">VAT</Label>
            <Input
              id="vat"
              value={formData.vat}
              onChange={(e) => handleInputChange('vat', e.target.value)}
              className="mt-1"
              placeholder="VAT number"
            />
          </div>
        </div>

        {/* Right Column - Contact */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Contact</h3>
          
          <div>
            <Label htmlFor="contact-person">Contact Person</Label>
            <Input
              id="contact-person"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1"
              placeholder="contact@company.com"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="mt-1"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* Additional Contact Information Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Additional Contacts</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addEmail}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Add Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addPhone}
              className="flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Add Phone
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {contactItems.slice(2).map((contact) => (
            <div key={contact.id} className="flex items-center gap-3">
              {contact.type === 'email' ? (
                <Mail className="h-4 w-4 text-gray-500" />
              ) : (
                <Phone className="h-4 w-4 text-gray-500" />
              )}
              <Input
                value={contact.value}
                onChange={(e) => handleContactChange(contact.id, e.target.value)}
                placeholder={contact.type === 'email' ? 'Additional email address' : 'Additional phone number'}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Button variant="link" size="sm" className="text-blue-600">
                  Contact
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContact(contact.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="min-h-[100px]"
          placeholder="Add notes about this supplier"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-slate-900 hover:bg-slate-800">
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
