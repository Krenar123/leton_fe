// src/components/common/VendorCombobox.tsx
import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSupplierList } from "@/hooks/useSupplierList";
import { createSupplier } from "@/services/api";

type Props = {
  value: string;                       // vendor name string
  onChange: (val: string) => void;
  placeholder?: string;
  autoCreate?: boolean;                // create on BE when adding a new name
};

export const VendorCombobox: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Type to search vendors…",
  autoCreate = true,
}) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const qc = useQueryClient();
  const { data: suppliers = [], isLoading } = useSupplierList();

  const filtered = suppliers.filter(s =>
    (query || "").length === 0 ? true : (s.company || "").toLowerCase().includes(query.toLowerCase())
  );

  const exists = suppliers.some(s => (s.company || "").toLowerCase() === (query || value).toLowerCase());
  const showCreate = (query || value).trim().length > 0 && !exists;

  const pick = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  const addNew = async (name: string) => {
    onChange(name); // optimistic
    if (autoCreate) {
      try {
        await createSupplier({ company: name });
        qc.invalidateQueries({ queryKey: ["suppliers"] });
      } catch (err) {
        console.error(err);
      }
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between bg-white">
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search vendors..." value={query} onValueChange={setQuery} />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>Loading…</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>No vendors found.</CommandEmpty>
                <CommandGroup heading="Vendors">
                  {filtered.map(s => (
                    <CommandItem key={s.ref || s.id} value={s.company} onSelect={() => pick(s.company)}>
                      <Check className={cn("mr-2 h-4 w-4", value === s.company ? "opacity-100" : "opacity-0")} />
                      {s.company}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {showCreate && (
                  <CommandGroup>
                    <CommandItem value={`__create__${query || value}`} onSelect={() => addNew(query || value)}>
                      <Plus className="mr-2 h-4 w-4" /> Add “{query || value}” as new vendor
                    </CommandItem>
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
