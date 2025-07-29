
import { useState } from "react";

export const useProjectDialogs = () => {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isBackstopsDialogOpen, setIsBackstopsDialogOpen] = useState(false);
  const [isMeetingsDialogOpen, setIsMeetingsDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [isContactsDialogOpen, setIsContactsDialogOpen] = useState(false);

  // New item states
  const [hasNewBackstops, setHasNewBackstops] = useState(true);
  const [hasNewNotes, setHasNewNotes] = useState(true);
  const [hasNewDocuments, setHasNewDocuments] = useState(true);
  const [hasNewContacts, setHasNewContacts] = useState(true);

  // Viewed states
  const [viewedNotes, setViewedNotes] = useState(false);
  const [viewedDocuments, setViewedDocuments] = useState(false);
  const [viewedContacts, setViewedContacts] = useState(false);

  const handleNotesCardClick = () => {
    setIsNotesDialogOpen(true);
    setViewedNotes(true);
    setHasNewNotes(false);
  };

  const handleDocumentsCardClick = () => {
    setIsDocumentsDialogOpen(true);
    setViewedDocuments(true);
    setHasNewDocuments(false);
  };

  const handleBackstopsCardClick = () => {
    setIsBackstopsDialogOpen(true);
    setHasNewBackstops(false);
  };

  const handleMeetingsCardClick = () => {
    setIsMeetingsDialogOpen(true);
  };

  const handleContactsCardClick = () => {
    setIsContactsDialogOpen(true);
    setViewedContacts(true);
    setHasNewContacts(false);
  };

  return {
    // Dialog states
    isProjectDialogOpen,
    setIsProjectDialogOpen,
    isBackstopsDialogOpen,
    setIsBackstopsDialogOpen,
    isMeetingsDialogOpen,
    setIsMeetingsDialogOpen,
    isNotesDialogOpen,
    setIsNotesDialogOpen,
    isDocumentsDialogOpen,
    setIsDocumentsDialogOpen,
    isContactsDialogOpen,
    setIsContactsDialogOpen,

    // New item states
    hasNewBackstops,
    hasNewNotes,
    hasNewDocuments,
    hasNewContacts,

    // Viewed states
    viewedNotes,
    viewedDocuments,
    viewedContacts,

    // Handlers
    handleNotesCardClick,
    handleDocumentsCardClick,
    handleBackstopsCardClick,
    handleMeetingsCardClick,
    handleContactsCardClick
  };
};
