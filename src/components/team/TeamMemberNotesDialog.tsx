
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreateNoteDialog } from "../projects/CreateNoteDialog";
import { EditNoteDialog } from "../projects/EditNoteDialog";
import { Plus, Search, Grid, List, Filter } from "lucide-react";

export interface Note {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
}

interface TeamMemberNotesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
}

const initialMockNotes: Note[] = [
  {
    id: 1,
    title: "Performance Review Notes",
    content: "<p>Excellent <strong>performance</strong> this quarter. Strong leadership skills demonstrated on the Downtown Office Complex project. Recommended for team lead position.</p>",
    category: "Performance",
    createdAt: "2024-10-15T10:30:00Z",
    updatedAt: "2024-10-15T10:30:00Z",
    isNew: true
  },
  {
    id: 2,
    title: "Training Completion",
    content: "<p>Completed <strong>safety training</strong> certification. Valid until March 2025. Copy of certificate uploaded to documents.</p>",
    category: "Training",
    createdAt: "2024-03-22T14:20:00Z",
    updatedAt: "2024-03-22T14:20:00Z"
  },
  {
    id: 3,
    title: "Project Assignment",
    content: "<p>Assigned to Shopping Mall Renovation project starting December 1st. Will be working with <strong>Mike Davis</strong> on structural improvements.</p>",
    category: "Projects",
    createdAt: "2024-11-28T09:15:00Z",
    updatedAt: "2024-12-01T11:00:00Z",
    isNew: true
  },
  {
    id: 4,
    title: "Salary Discussion",
    content: "<p>Discussed <strong>salary adjustment</strong> for next year. Performance bonus approved for Q4 achievements.</p>",
    category: "HR",
    createdAt: "2024-12-01T13:20:00Z",
    updatedAt: "2024-12-01T13:20:00Z"
  }
];

export const TeamMemberNotesDialog = ({ 
  isOpen, 
  onOpenChange, 
  memberName 
}: TeamMemberNotesDialogProps) => {
  const [notes, setNotes] = useState<Note[]>(initialMockNotes);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = Array.from(new Set(notes.map(note => note.category)));
  
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // Check if any filters are applied
  const hasActiveFilters = selectedCategory !== "all";

  const handleCreateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNew: true
    };
    setNotes(prev => [newNote, ...prev]);
    setIsCreateDialogOpen(false);
    console.log('New note created:', newNote);
  };

  const handleEditNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? {
        ...updatedNote,
        updatedAt: new Date().toISOString()
      } : note
    ));
    setIsEditDialogOpen(false);
    setEditingNote(null);
    console.log('Note updated:', updatedNote);
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
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Notes - {memberName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search notes..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
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
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-[#0a1f44]">
                      <Plus className="w-4 h-4 mr-2" />
                      New Note
                    </Button>
                  </DialogTrigger>
                  <CreateNoteDialog 
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
                    className="border rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm bg-white" 
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {filteredNotes.map(note => (
                  <div 
                    key={note.id} 
                    className="border rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm bg-white" 
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
          <EditNoteDialog 
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
