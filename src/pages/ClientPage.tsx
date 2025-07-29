import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { ClientHeader } from "@/components/clients/ClientHeader";
import { ClientDialogs } from "@/components/clients/ClientDialogs";
import { ClientContent } from "@/components/clients/ClientContent";
import { ClientEditDialog } from "@/components/clients/ClientEditDialog";
import { useClientData } from "@/hooks/useClientData";
import { useClientDialogs } from "@/hooks/useClientDialogs";

const ClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    client,
    projects,
    bills,
    meetings,
    handleClientUpdate
  } = useClientData(id || "");
  const {
    isClientDialogOpen,
    setIsClientDialogOpen,
    isNotesDialogOpen,
    setIsNotesDialogOpen,
    hasNewNotes,
    viewedNotes,
    handleNotesCardClick
  } = useClientDialogs();

  // Add state for documents and meetings dialogs
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [isMeetingsDialogOpen, setIsMeetingsDialogOpen] = useState(false);

  const handleDocumentsClick = () => {
    setIsDocumentsDialogOpen(true);
  };

  const handleMeetingsClick = () => {
    setIsMeetingsDialogOpen(true);
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Client Not Found</h2>
          <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/clients')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen px-0 py-0 bg-inherit mx-0">
      {/* Client Information Header */}
      <div className="mx-4">
        <ClientHeader 
          client={client} 
          isClientDialogOpen={isClientDialogOpen} 
          setIsClientDialogOpen={setIsClientDialogOpen} 
          onClientUpdate={handleClientUpdate} 
          onNotesClick={handleNotesCardClick} 
          onDocumentsClick={handleDocumentsClick}
          onMeetingsClick={handleMeetingsClick}
        />
      </div>

      {/* Edit Client Dialog */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <ClientEditDialog 
          client={client} 
          onClose={() => setIsClientDialogOpen(false)} 
          onUpdate={handleClientUpdate} 
        />
      </Dialog>

      {/* Other Dialogs */}
      <ClientDialogs 
        client={client} 
        isNotesDialogOpen={isNotesDialogOpen} 
        setIsNotesDialogOpen={setIsNotesDialogOpen} 
        isDocumentsDialogOpen={isDocumentsDialogOpen} 
        setIsDocumentsDialogOpen={setIsDocumentsDialogOpen}
        isMeetingsDialogOpen={isMeetingsDialogOpen}
        setIsMeetingsDialogOpen={setIsMeetingsDialogOpen}
      />

      {/* Main Content */}
      <ClientContent 
        client={client} 
        projects={projects} 
        bills={bills} 
        meetings={meetings} 
        hasNewNotes={hasNewNotes} 
        viewedNotes={viewedNotes} 
        onNotesClick={handleNotesCardClick} 
        onContactClick={() => setIsClientDialogOpen(true)} 
      />
    </div>
  );
};

export default ClientPage;
