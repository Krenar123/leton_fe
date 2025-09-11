import { useState, useMemo } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreateNoteDialog } from "./CreateNoteDialog";
import { EditNoteDialog } from "./EditNoteDialog";
import { Plus, Search, Grid, List, Filter, Pin, PinOff } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjectNotes,
  createProjectNote,
  updateProjectNote,
  deleteProjectNote
} from "@/services/api";

export interface Note {
  id: string;          // use ref string from BE
  title: string;       // required
  body: string;        // required (renamed from content)
  pinned: boolean;     // required
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
}

interface NotesDialogProps {
  projectRef: string;
  projectName: string;
  onClose: () => void;
}

export const NotesDialog = ({
  projectRef,
  projectName,
  onClose
}: NotesDialogProps) => {
  const qc = useQueryClient();

  // Fetch raw jsonapi
  const { data: notesRaw, isLoading } = useQuery({
    queryKey: ["projectNotes", projectRef],
    queryFn: () => fetchProjectNotes(projectRef),
    enabled: !!projectRef
  });

  // Map jsonapi -> flat
  const notes: Note[] = useMemo(() => {
    const arr = Array.isArray(notesRaw?.data) ? notesRaw!.data : [];
    return arr.map((e: any) => {
      const a = e.attributes || {};
      return {
        id: e.id,
        title: a.title,
        body: a.body || "",
        pinned: a.pinned || false,
        createdAt: a.createdAt || a.created_at,
        updatedAt: a.updatedAt || a.updated_at
      };
    });
  }, [notesRaw]);

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const filteredNotes = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return notes
      .filter(n => {
        const matchesSearch =
          n.title.toLowerCase().includes(lower) ||
          n.body.toLowerCase().includes(lower);
        const matchesPinned = !showPinnedOnly || n.pinned;
        return matchesSearch && matchesPinned;
      })
      .sort((a, b) => {
        // Pinned notes first, then by updated date
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, searchTerm, showPinnedOnly]);

  // Mutations
  const createMut = useMutation({
    mutationFn: (noteData: any) => createProjectNote(projectRef, noteData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projectNotes", projectRef] });
      setIsCreateDialogOpen(false);
    }
  });

  const updateMut = useMutation({
    mutationFn: ({ noteRef, noteData }: { noteRef: string; noteData: any }) => 
      updateProjectNote(projectRef, noteRef, noteData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projectNotes", projectRef] });
      setIsEditDialogOpen(false);
      setEditingNote(null);
    }
  });

  const deleteMut = useMutation({
    mutationFn: (noteRef: string) => deleteProjectNote(projectRef, noteRef),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["projectNotes", projectRef] });
    }
  });

  const handleCreateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    createMut.mutate({
      title: noteData.title,
      body: noteData.body,
      pinned: noteData.pinned
    });
  };

  const handleEditNote = (updatedNote: Note) => {
    updateMut.mutate({
      noteRef: updatedNote.id,
      noteData: {
        title: updatedNote.title,
        body: updatedNote.body,
        pinned: updatedNote.pinned
      }
    });
  };

  const handleDeleteNote = (noteRef: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteMut.mutate(noteRef);
    }
  };

  const handleTogglePin = (note: Note) => {
    updateMut.mutate({
      noteRef: note.id,
      noteData: {
        title: note.title,
        body: note.body,
        pinned: !note.pinned
      }
    });
  };

  const handleNoteClick = (note: Note) => {
    setEditingNote(note);
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div>
      <DialogContent className="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Notes - {projectName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search notes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} 
                className="text-[#0a1f44] text-base bg-transparent rounded-sm"
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
              
              <Button
                variant={showPinnedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className="text-[#0a1f44] text-base bg-transparent rounded-sm"
              >
                {showPinnedOnly ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                {showPinnedOnly ? " Show All" : " Pinned Only"}
              </Button>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#0a1f44]">
                    <Plus className="w-4 h-4 mr-2" />
                    New Note
                  </Button>
                </DialogTrigger>
                <CreateNoteDialog 
                  projectRef={projectRef}
                  onCreateNote={handleCreateNote} 
                  onClose={() => setIsCreateDialogOpen(false)} 
                />
              </Dialog>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredNotes.length}</span> notes
            {showPinnedOnly && " (pinned only)"}
          </div>

          {/* Notes Display */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading notes...</div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto">
              {filteredNotes.map(note => (
                <div key={note.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors shadow-sm bg-white relative group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2 flex-1">
                      <h3 className="font-medium text-gray-900 text-base truncate">{note.title}</h3>
                      {note.pinned && <Pin className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePin(note);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        {note.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  
                  <div 
                    className="text-sm text-gray-600 mb-4 line-clamp-4 cursor-pointer"
                    onClick={() => handleNoteClick(note)}
                  >
                    {truncateText(stripHtml(note.body), 150)}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {formatDate(note.createdAt)}</span>
                    {note.createdAt !== note.updatedAt && <span>Updated: {formatDate(note.updatedAt)}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {filteredNotes.map(note => (
                <div key={note.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors shadow-sm bg-white relative group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{note.title}</h3>
                      {note.pinned && <Pin className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(note);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                          {note.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                      <div className="text-right">
                        <div>{formatDate(note.createdAt)}</div>
                        {note.createdAt !== note.updatedAt && <div className="text-xs">Updated: {formatDate(note.updatedAt)}</div>}
                      </div>
                    </div>
                  </div>
                  <div 
                    className="text-gray-600 leading-relaxed cursor-pointer"
                    onClick={() => handleNoteClick(note)}
                  >
                    {truncateText(stripHtml(note.body), 200)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredNotes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No notes found matching your search." : "No notes yet. Create your first note!"}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Edit Note Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {editingNote && (
          <EditNoteDialog 
            projectRef={projectRef}
            note={editingNote} 
            onEditNote={handleEditNote} 
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingNote(null);
            }} 
          />
        )}
      </Dialog>
    </div>
  );
};
