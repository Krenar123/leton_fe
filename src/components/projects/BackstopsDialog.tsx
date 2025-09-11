
import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { AddBackstopDialog } from "./AddBackstopDialog";
import { useBackstopsData } from "./backstops/useBackstopsData";
import { BackstopsFilter } from "./backstops/BackstopsFilter";
import { BackstopsTable } from "./backstops/BackstopsTable";
import { BackstopsDialogProps } from "./backstops/types";

export const BackstopsDialog = ({ projectRef, projectName, onClose }: BackstopsDialogProps) => {
  const [statusFilter, setStatusFilter] = useState<"all" | "reached">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { backstops, totalBackstops, reachedBackstops, handleDeleteBackstop, refetchBackstops } = useBackstopsData(projectRef);
  
  const filteredBackstops = backstops.filter(backstop => {
    const matchesStatusFilter = statusFilter === "all" || (statusFilter === "reached" && backstop.isReached);
    const matchesTypeFilter = typeFilter === "all" || backstop.type === typeFilter;
    const matchesSearch = backstop.what.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backstop.where.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatusFilter && matchesTypeFilter && matchesSearch;
  });

  // Check if any filters are applied
  const hasActiveFilters = statusFilter !== "all" || typeFilter !== "all";

  return (
    <>
      <DialogContent className="sm:max-w-[1400px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Backstops - {projectName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search, Filter and Add Controls - Consistent Layout */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search backstops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <BackstopsFilter
              statusFilter={statusFilter}
              typeFilter={typeFilter}
              onStatusFilterChange={setStatusFilter}
              onTypeFilterChange={setTypeFilter}
              hasActiveFilters={hasActiveFilters}
            />
            
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Backstop
            </Button>
          </div>

          {/* Stats */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">{reachedBackstops}</span> of <span className="font-medium">{totalBackstops}</span> backstops reached
          </div>

          {/* Backstops Table */}
          <BackstopsTable
            backstops={filteredBackstops}
            onDeleteBackstop={handleDeleteBackstop}
            onClose={onClose}
          />

          {filteredBackstops.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-lg font-medium mb-2">No backstops found</div>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </DialogContent>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <AddBackstopDialog
          projectRef={projectRef}
          onClose={() => setIsAddDialogOpen(false)}
          onSuccess={() => {
            refetchBackstops();
            setIsAddDialogOpen(false);
          }}
        />
      </Dialog>
    </>
  );
};
