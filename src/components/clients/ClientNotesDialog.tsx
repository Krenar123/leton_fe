// src/components/clients/ClientNotesDialog.tsx
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Search, Grid, List, Filter, Edit, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchClientNotes,
  createClientNote,
  updateClientNote,
  deleteClientNote
} from "@/services/api";
import { CreateClientNoteDialog } from "./CreateClientNoteDialog";
import { EditClientNoteDialog } from "./EditClientNoteDialog";

interface ClientNotesDialogProps {
  clientRef: string;        // <-- add this
  clientName: string;
  onClose: () => void;
}

export interface ClientNote {
  id: string;          // use ref string from BE
  title: string;
  content: string;     // HTML
  category: string;    // maps to note_type enum key on BE
  createdAt: string;
  updatedAt: string;
}

export const ClientNotesDialog = ({ clientRef, clientName }: ClientNotesDialogProps) => {
  const qc = useQueryClient();

  // Fetch raw jsonapi
  const { data: notesRaw, isLoading } = useQuery({
    queryKey: ["clientNotes", clientRef],
    queryFn: () => fetchClientNotes(clientRef),
    enabled: !!clientRef
  });

  // Map jsonapi -> flat
  const notes: ClientNote[] = useMemo(() => {
    const arr = Array.isArray(notesRaw?.data) ? notesRaw!.data : [];
    return arr.map((e: any) => {
      const a = e.attributes || {};
      return {
        id: e.id,
        title: a.title,
        content: a.content || "",
        category: a.category || "general",
        createdAt: a.createdAt || a.created_at,
        updatedAt: a.updatedAt || a.updated_at
      };
    });
  }, [notesRaw]);

  // Local UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<ClientNote | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(notes.map(n => n.category))),
    [notes]
  );

  const filteredNotes = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return notes
      .filter(n => {
        const matchesSearch =
          n.title.toLowerCase().includes(lower) ||
          n.content.toLowerCase().includes(lower);
        const matchesCategory = selectedCategory === "all" || n.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, searchTerm, selectedCategory]);

  // Mutations
  const createMut = useMutation({
    mutationFn: (payload: { title: string; content: string; category: string }) =>
      createClientNote(clientRef, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientNotes", clientRef] })
  });

  const updateMut = useMutation({
    mutationFn: (p: { noteRef: string; title: string; content: string; category: string }) =>
      updateClientNote(clientRef, p.noteRef, { title: p.title, content: p.content, category: p.category }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientNotes", clientRef] })
  });

  const deleteMut = useMutation({
    mutationFn: (noteRef: string) => deleteClientNote(clientRef, noteRef),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientNotes", clientRef] })
  });

  // Handlers calling mutations
  const handleCreateNote = (noteData: Omit<ClientNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    createMut.mutate({
      title: noteData.title,
      content: noteData.content,
      category: noteData.category || "general"
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditNote = (noteData: Omit<ClientNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingNote) return;
    updateMut.mutate({
      noteRef: editingNote.id,
      title: noteData.title,
      content: noteData.content,
      category: noteData.category || "general"
    });
    setIsEditDialogOpen(false);
    setEditingNote(null);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteMut.mutate(noteId);
  };

  // helpers
  const formatDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");
  const truncateText = (t: string, n = 120) => (t.length <= n ? t : t.slice(0, n) + "...");

  const hasActiveFilters = selectedCategory !== "all";

  return (
    <>
      <DialogContent className="sm:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Notes for {clientName}</DialogTitle>
        </DialogHeader>

        {/* Top bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
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

              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100">
                    <Filter className={`w-4 h-4 ${hasActiveFilters ? 'text-[#d9a44d]' : 'text-gray-600'}`} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-1">
                    <button
                      onClick={() => { setSelectedCategory("all"); setIsFilterOpen(false); }}
                      className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${selectedCategory === "all" ? "bg-gray-100 font-medium" : ""}`}
                    >
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => { setSelectedCategory(category); setIsFilterOpen(false); }}
                        className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${selectedCategory === category ? "bg-gray-100 font-medium" : ""}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#0a1f44]">
                    <Plus className="w-4 h-4 mr-2" />
                    New Note
                  </Button>
                </DialogTrigger>
                <CreateClientNoteDialog
                  onCreateNote={handleCreateNote}
                  onClose={() => setIsCreateDialogOpen(false)}
                  existingCategories={categories}
                />
              </Dialog>
            </div>
          </div>

          {/* Count */}
          <div className="text-sm text-gray-600">
            {isLoading ? "Loading…" : (<><span className="font-medium">{filteredNotes.length}</span> notes{selectedCategory !== "all" && ` in ${selectedCategory}`}</>)}
          </div>

          {/* List/Grid */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className="border rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm bg-white relative group"
                  onClick={() => { setEditingNote(note); setIsEditDialogOpen(true); }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 text-base truncate">{note.title}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {note.category}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600 mb-4 line-clamp-4">
                    {truncateText(stripHtml(note.content), 150)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {formatDate(note.createdAt)}</span>
                    {note.createdAt !== note.updatedAt && <span>Updated: {formatDate(note.updatedAt)}</span>}
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button
                      variant="ghost" size="sm" className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); setEditingNote(note); setIsEditDialogOpen(true); }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost" size="sm" className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  className="border rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm bg-white relative group"
                  onClick={() => { setEditingNote(note); setIsEditDialogOpen(true); }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{note.title}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <Badge variant="outline" className="text-xs">{note.category}</Badge>
                      <div className="text-right">
                        <div>{formatDate(note.createdAt)}</div>
                        {note.createdAt !== note.updatedAt && (<div className="text-xs">Updated: {formatDate(note.updatedAt)}</div>)}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-600 leading-relaxed">
                    {truncateText(stripHtml(note.content), 200)}
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); setEditingNote(note); setIsEditDialogOpen(true); }}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0"
                      onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredNotes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No notes found matching your search." : "No notes in this category."}
            </div>
          )}
        </div>
      </DialogContent>

      {/* Edit Note Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {editingNote && (
          <EditClientNoteDialog
            note={editingNote}
            onEditNote={handleEditNote}
            onClose={() => { setIsEditDialogOpen(false); setEditingNote(null); }}
            existingCategories={categories}
          />
        )}
      </Dialog>
    </>
  );
};
