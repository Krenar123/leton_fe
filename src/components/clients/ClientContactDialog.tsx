
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Edit, Save, X, Building } from "lucide-react";
import { useState } from "react";
import { Client } from "@/types/client";

interface ClientContactDialogProps {
  client: Client;
  onClose: () => void;
}

export const ClientContactDialog = ({ client, onClose }: ClientContactDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: client.email,
    phone: client.phone,
    address: client.address,
    businessNumber: client.businessNumber || '',
    vat: client.vat || ''
  });

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving contact info:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      email: client.email,
      phone: client.phone,
      address: client.address,
      businessNumber: client.businessNumber || '',
      vat: client.vat || ''
    });
    setIsEditing(false);
  };

  const handleEmailClick = () => {
    window.open(`mailto:${client.email}`, '_self');
  };

  const handlePhoneClick = () => {
    window.open(`tel:${client.phone}`, '_self');
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>Contact Information - {client.name}</DialogTitle>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {/* Company Information */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Company</Label>
          <p className="font-medium text-gray-900">{client.company}</p>
        </div>

        {/* Business Number */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Business Number</Label>
          {isEditing ? (
            <Input
              type="text"
              value={formData.businessNumber}
              onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
              className="mt-1"
              placeholder="Enter business number"
            />
          ) : (
            <div className="flex items-start space-x-2 mt-1 p-2 border rounded-md">
              <Building className="w-4 h-4 text-gray-500 mt-1" />
              <p className="text-gray-900">{client.businessNumber || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* VAT Number */}
        <div>
          <Label className="text-sm font-medium text-gray-600">VAT Number (Optional)</Label>
          {isEditing ? (
            <Input
              type="text"
              value={formData.vat}
              onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
              className="mt-1"
              placeholder="Enter VAT number"
            />
          ) : (
            <div className="flex items-start space-x-2 mt-1 p-2 border rounded-md">
              <Building className="w-4 h-4 text-gray-500 mt-1" />
              <p className="text-gray-900">{client.vat || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Email Address</Label>
          {isEditing ? (
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1"
            />
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start mt-1 text-blue-600 hover:text-blue-800"
              onClick={handleEmailClick}
            >
              <Mail className="w-4 h-4 mr-2" />
              {client.email}
            </Button>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Phone Number</Label>
          {isEditing ? (
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1"
            />
          ) : (
            <Button
              variant="outline"
              className="w-full justify-start mt-1 text-blue-600 hover:text-blue-800"
              onClick={handlePhoneClick}
            >
              <Phone className="w-4 h-4 mr-2" />
              {client.phone}
            </Button>
          )}
        </div>

        {/* Address */}
        <div>
          <Label className="text-sm font-medium text-gray-600">Address</Label>
          {isEditing ? (
            <Textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1"
              rows={3}
            />
          ) : (
            <div className="flex items-start space-x-2 mt-1 p-2 border rounded-md">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <p className="text-gray-900">{client.address}</p>
            </div>
          )}
        </div>

        {/* Client Description */}
        {client.description && (
          <div>
            <Label className="text-sm font-medium text-gray-600">Notes</Label>
            <p className="text-gray-900 mt-1">{client.description}</p>
          </div>
        )}
      </div>
    </DialogContent>
  );
};
