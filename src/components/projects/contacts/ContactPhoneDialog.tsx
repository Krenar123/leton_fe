
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Contact } from "./types";

interface ContactPhoneDialogProps {
  contact: Contact;
  onClose: () => void;
}

export const ContactPhoneDialog = ({ contact, onClose }: ContactPhoneDialogProps) => {
  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
    onClose();
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Phone Numbers - {contact.name}</DialogTitle>
      </DialogHeader>

      <div className="space-y-2">
        {contact.phones.map((phone, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-blue-600 hover:text-blue-800"
            onClick={() => handlePhoneClick(phone)}
          >
            <Phone className="w-4 h-4 mr-2" />
            {phone}
          </Button>
        ))}
      </div>
    </DialogContent>
  );
};
