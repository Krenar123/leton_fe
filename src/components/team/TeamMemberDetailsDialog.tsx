
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, User, Building, DollarSign } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  wagePerHour?: number;
}

interface TeamMemberDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember;
  onMemberUpdate: (updatedMember: TeamMember) => void;
}

export const TeamMemberDetailsDialog = ({
  isOpen,
  onOpenChange,
  member,
  onMemberUpdate
}: TeamMemberDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState(member);

  const handleSave = () => {
    onMemberUpdate(editedMember);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedMember(member);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {member.avatar}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-slate-600 font-normal">{member.position}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editedMember.name}
                    onChange={(e) => setEditedMember({...editedMember, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={editedMember.position}
                    onChange={(e) => setEditedMember({...editedMember, position: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={editedMember.department}
                  onChange={(e) => setEditedMember({...editedMember, department: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editedMember.email}
                    onChange={(e) => setEditedMember({...editedMember, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editedMember.phone}
                    onChange={(e) => setEditedMember({...editedMember, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editedMember.address}
                  onChange={(e) => setEditedMember({...editedMember, address: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="wagePerHour">Wage per Hour ($)</Label>
                <Input
                  id="wagePerHour"
                  type="number"
                  value={editedMember.wagePerHour || ""}
                  onChange={(e) => setEditedMember({...editedMember, wagePerHour: parseFloat(e.target.value) || undefined})}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Full Name</p>
                      <p className="font-medium">{member.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Department</p>
                      <p className="font-medium">{member.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium">{member.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium">{member.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Address</p>
                      <p className="font-medium">{member.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-500">Wage per Hour</p>
                      <p className="font-medium">${member.wagePerHour || 45}/hour</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsEditing(true)}>
                  Edit Information
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
