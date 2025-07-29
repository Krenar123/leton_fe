
import { useState } from "react";

export const useSupplierDialogs = () => {
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);
  const [isMeetingsDialogOpen, setIsMeetingsDialogOpen] = useState(false);
  const [hasNewNotes, setHasNewNotes] = useState(true);
  const [viewedNotes, setViewedNotes] = useState(false);

  const handleNotesCardClick = () => {
    setIsNotesDialogOpen(true);
    if (hasNewNotes) {
      setHasNewNotes(false);
      setViewedNotes(true);
    }
  };

  const handleDocumentsClick = () => {
    setIsDocumentsDialogOpen(true);
  };

  const handleMeetingsClick = () => {
    setIsMeetingsDialogOpen(true);
  };

  return {
    isSupplierDialogOpen,
    setIsSupplierDialogOpen,
    isNotesDialogOpen,
    setIsNotesDialogOpen,
    isDocumentsDialogOpen,
    setIsDocumentsDialogOpen,
    isMeetingsDialogOpen,
    setIsMeetingsDialogOpen,
    hasNewNotes,
    viewedNotes,
    handleNotesCardClick,
    handleDocumentsClick,
    handleMeetingsClick
  };
};
