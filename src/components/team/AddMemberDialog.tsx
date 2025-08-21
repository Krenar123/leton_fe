import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface AddMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (member: {
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    address: string;
  }) => void;
  departments: string[];
}

const CUSTOM_DEPT = "__NEW_CUSTOM_DEPARTMENT__";

export const AddMemberDialog = ({
  isOpen,
  onOpenChange,
  onAddMember,
  departments
}: AddMemberDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    address: ""
  });

  const [deptMode, setDeptMode] = useState<"select" | "custom">("select");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const customDeptInputRef = useRef<HTMLInputElement>(null);

  // unique, sorted department list (just in case)
  const deptOptions = useMemo(() => {
    const set = new Set(departments.filter(Boolean).map(d => d.trim()));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [departments]);

  useEffect(() => {
    if (!isOpen) {
      // reset when closed
      setFormData({
        name: "",
        position: "",
        department: "",
        email: "",
        phone: "",
        address: ""
      });
      setDeptMode("select");
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSelectDept = (value: string) => {
    if (value === CUSTOM_DEPT) {
      setDeptMode("custom");
      setFormData(prev => ({ ...prev, department: "" }));
      // focus custom input next tick
      setTimeout(() => customDeptInputRef.current?.focus(), 0);
    } else {
      setDeptMode("select");
      handleChange("department", value);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const trimmed = {
      name: formData.name.trim(),
      position: formData.position.trim(),
      email: formData.email.trim(),
      department:
        deptMode === "custom"
          ? formData.department.trim()
          : formData.department.trim(),
    };

    if (!trimmed.name) e.name = "Full name is required";
    if (!trimmed.position) e.position = "Position is required";
    if (!trimmed.department) e.department = "Department is required";
    if (!trimmed.email) e.email = "Email is required";
    else {
      // light email sanity check
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email);
      if (!ok) e.email = "Enter a valid email";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      position: formData.position.trim(),
      department: formData.department.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    };

    onAddMember(payload);

    // reset & close
    setFormData({
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      address: ""
    });
    setDeptMode("select");
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="John Smith"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                placeholder="Project Manager"
                aria-invalid={!!errors.position}
              />
              {errors.position && <p className="mt-1 text-xs text-red-600">{errors.position}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Department *</Label>

            {deptMode === "select" && (
              <Select
                value={formData.department || ""}
                onValueChange={handleSelectDept}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {deptOptions.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                  <SelectItem value={CUSTOM_DEPT}>Other…</SelectItem>
                </SelectContent>
              </Select>
            )}

            {deptMode === "custom" && (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Input
                    ref={customDeptInputRef}
                    placeholder="Type new department"
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    aria-invalid={!!errors.department}
                  />
                  {errors.department && (
                    <p className="mt-1 text-xs text-red-600">{errors.department}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDeptMode("select");
                    setFormData(prev => ({ ...prev, department: "" }));
                  }}
                >
                  Back
                </Button>
              </div>
            )}

            {deptMode === "select" && errors.department && (
              <p className="mt-1 text-xs text-red-600">{errors.department}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john@company.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 234 567 8901"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="123 Main St, City, State"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-800 hover:bg-slate-700">
              Add Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
