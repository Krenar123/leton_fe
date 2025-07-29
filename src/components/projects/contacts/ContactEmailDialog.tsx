
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Contact } from "./types";

interface ContactEmailDialogProps {
  contact: Contact;
  onClose: () => void;
}

export const ContactEmailDialog = ({ contact, onClose }: ContactEmailDialogProps) => {
  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_self');
    onClose();
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Email Addresses - {contact.name}</DialogTitle>
      </DialogHeader>

      <div className="space-y-2">
        {contact.emails.map((email, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-blue-600 hover:text-blue-800"
            onClick={() => handleEmailClick(email)}
          >
            <Mail className="w-4 h-4 mr-2" />
            {email}
          </Button>
        ))}
      </div>
    </DialogContent>
  );
};
