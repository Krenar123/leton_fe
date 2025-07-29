
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Send, Upload, X } from "lucide-react";

interface ContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const contactReasons = [
  { value: "technical-support", label: "Technical Support" },
  { value: "billing-question", label: "Billing Question" },
  { value: "feature-request", label: "Feature Request" },
  { value: "bug-report", label: "Bug Report" },
  { value: "account-issue", label: "Account Issue" },
  { value: "general-inquiry", label: "General Inquiry" },
  { value: "other", label: "Other" }
];

export const ContactDialog = ({ isOpen, onClose }: ContactDialogProps) => {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    // Reset the input value so the same file can be selected again
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason || !message.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setShowConfirmation(true);
    
    // Hide confirmation after 3 seconds and close dialog
    setTimeout(() => {
      setShowConfirmation(false);
      setReason("");
      setMessage("");
      setUploadedFiles([]);
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    if (!showConfirmation) {
      setReason("");
      setMessage("");
      setUploadedFiles([]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Contact Leton Team
          </DialogTitle>
        </DialogHeader>

        {showConfirmation ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-slate-900">Message Sent!</h3>
              <p className="text-slate-600">
                We've received your message and will contact you as soon as possible.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Reason for Contact *
              </label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason for your contact" />
                </SelectTrigger>
                <SelectContent>
                  {contactReasons.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Message *
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe what you need help with or what you'd like to know..."
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-slate-500">
                Please provide as much detail as possible to help us assist you better.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">
                Attachments (Optional)
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.xlsx,.xls"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Files</span>
                  </Button>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded border">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-sm font-medium truncate">{file.name}</span>
                          <span className="text-xs text-slate-500">({formatFileSize(file.size)})</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0 hover:bg-red-100"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    <p className="text-xs text-slate-500">
                      {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {(!reason || !message.trim()) && (
              <Alert>
                <AlertDescription className="text-sm">
                  Please select a reason and enter your message before sending.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!reason || !message.trim() || isSubmitting}
                className="flex-1 bg-[#0a1f44] hover:bg-[#0d2356] text-white"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
