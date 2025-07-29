
import { useState } from "react";

export const useClientDialogs = () => {
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);

  // New item states
  const [hasNewNotes, setHasNewNotes] = useState(true);

  // Viewed states
  const [viewedNotes, setViewedNotes] = useState(false);

  const handleNotesCardClick = () => {
    setIsNotesDialogOpen(true);
    setViewedNotes(true);
    setHasNewNotes(false);
  };

  return {
    // Dialog states
    isClientDialogOpen,
    setIsClientDialogOpen,
    isNotesDialogOpen,
    setIsNotesDialogOpen,

    // New item states
    hasNewNotes,

    // Viewed states
    viewedNotes,

    // Handlers
    handleNotesCardClick
  };
};
