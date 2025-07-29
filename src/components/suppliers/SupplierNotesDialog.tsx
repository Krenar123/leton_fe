
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Search, Grid, List, Filter, Edit, Trash2 } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { CreateSupplierNoteDialog } from "./CreateSupplierNoteDialog";
import { EditSupplierNoteDialog } from "./EditSupplierNoteDialog";

interface SupplierNote {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
}

interface SupplierNotesDialogProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
}

const mockNotes: SupplierNote[] = [
  {
    id: 1,
    title: "Initial Meeting",
    content: "<p>Discussed project requirements and timeline. Supplier seems <strong>reliable</strong> and has good references.</p>",
    category: "Meeting Notes",
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2025-07-01T10:00:00Z",
    isNew: true
  },
  {
    id: 2,
    title: "Quality Assessment",
    content: "<p>Reviewed previous work samples. <strong>Excellent quality</strong> and attention to detail. Recommended for complex projects.</p>",
    category: "Assessment",
    createdAt: "2025-07-05T14:30:00Z",
    updatedAt: "2025-07-05T14:30:00Z",
    isNew: true
  },
  {
    id: 3,
    title: "Contract Terms",
    content: "<p>Negotiated contract terms. Supplier agreed to <strong>flexible payment schedule</strong> and milestone-based deliveries.</p>",
    category: "Contract",
    createdAt: "2025-07-07T16:15:00Z",
    updatedAt: "2025-07-07T16:15:00Z"
  }
];

export const SupplierNotesDialog = ({
  supplier,
  isOpen,
  onClose
}: SupplierNotesDialogProps) => {
  const [notes, setNotes] = useState<SupplierNote[]>(mockNotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<SupplierNote | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = Array.from(new Set(notes.map(note => note.category)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const hasActiveFilters = selectedCategory !== "all";

  const handleCreateNote = (noteData: Omit<SupplierNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: SupplierNote = {
      id: Date.now(),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNew: true
    };
    setNotes([newNote, ...notes]);
    setIsCreateDialogOpen(false);
  };

  const handleEditNote = (noteData: Omit<SupplierNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote) {
      const updatedNote: SupplierNote = {
        ...editingNote,
        ...noteData,
        updatedAt: new Date().toISOString()
      };
      setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note));
      setIsEditDialogOpen(false);
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleNoteClick = (note: SupplierNote) => {
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Notes - {supplier.company}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                        onClick={() => {
                          setSelectedCategory("all");
                          setIsFilterOpen(false);
                        }} 
                        className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${selectedCategory === "all" ? "bg-gray-100 font-medium" : ""}`}
                      >
                        All Categories
                      </button>
                      {categories.map(category => (
                        <button 
                          key={category} 
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false);
                          }} 
                          className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${selectedCategory === category ? "bg-gray-100 font-medium" : ""}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <Button 
                    size="sm" 
                    className="bg-[#0a1f44]"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Note
                  </Button>
                  <CreateSupplierNoteDialog 
                    onCreateNote={handleCreateNote} 
                    onClose={() => setIsCreateDialogOpen(false)} 
                    existingCategories={categories} 
                  />
                </Dialog>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-medium">{filteredNotes.length}</span> notes
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </div>

            {/* Notes Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto">
                {filteredNotes.map(note => (
                  <div 
                    key={note.id} 
                    className="border rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm bg-white relative group" 
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 text-base truncate">{note.title}</h3>
                        {note.isNew && <Badge variant="default" className="text-xs bg-[#d9a44d]">New</Badge>}
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
                      {note.createdAt !== note.updatedAt && (
                        <span>Updated: {formatDate(note.updatedAt)}</span>
                      )}
                    </div>

                    {/* Action buttons - visible on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingNote(note);
                          setIsEditDialogOpen(true);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="h-6 w-6 p-0"
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
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{note.title}</h3>
                        {note.isNew && <Badge variant="default" className="text-xs">New</Badge>}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs">
                          {note.category}
                        </Badge>
                        <div className="text-right">
                          <div>{formatDate(note.createdAt)}</div>
                          {note.createdAt !== note.updatedAt && (
                            <div className="text-xs">Updated: {formatDate(note.updatedAt)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-600 leading-relaxed">
                      {truncateText(stripHtml(note.content), 200)}
                    </div>

                    {/* Action buttons - visible on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingNote(note);
                          setIsEditDialogOpen(true);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredNotes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No notes found matching your search." : "No notes in this category."}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {editingNote && (
          <EditSupplierNoteDialog
            note={editingNote}
            onEditNote={handleEditNote}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingNote(null);
            }}
            existingCategories={categories}
          />
        )}
      </Dialog>
    </>
  );
};
