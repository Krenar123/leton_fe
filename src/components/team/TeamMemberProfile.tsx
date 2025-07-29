
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, StickyNote, FileBarChart, Menu } from "lucide-react";

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

interface TeamMemberProfileProps {
  member: TeamMember;
  onEditClick: () => void;
  onDocumentsClick: () => void;
  onNotesClick: () => void;
  onCreateReportClick: () => void;
}

export const TeamMemberProfile = ({
  member,
  onEditClick,
  onDocumentsClick,
  onNotesClick,
  onCreateReportClick
}: TeamMemberProfileProps) => {
  return (
    <div className="flex gap-4">
      {/* Left Info Box */}
      <Card className="bg-slate-800 cursor-pointer transition-colors hover:bg-slate-700 flex-1" onClick={onEditClick}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`} alt={member.name} />
              <AvatarFallback className="bg-blue-600 text-white font-semibold text-xl">
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-2">{member.name}</h2>
              <div className="space-y-1">
                <p className="text-slate-300 text-sm">{member.position}</p>
                <p className="text-slate-300 text-sm">{member.department}</p>
                <p className="text-slate-300 text-sm">{member.phone}</p>
                <p className="text-slate-300 text-sm">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center text-white">
              <Menu className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Action Buttons */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={onDocumentsClick}
          variant="ghost"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 h-auto py-3 px-4 flex flex-col items-center gap-1 min-w-[80px]"
        >
          <FileText className="h-4 w-4" />
          <span className="text-xs">Documents</span>
        </Button>
        
        <Button
          onClick={onNotesClick}
          variant="ghost"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-0 h-auto py-3 px-4 flex flex-col items-center gap-1 min-w-[80px]"
        >
          <StickyNote className="h-4 w-4" />
          <span className="text-xs">Notes</span>
        </Button>
        
        <Button
          onClick={onCreateReportClick}
          variant="ghost"
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-0 h-auto py-3 px-4 flex flex-col items-center gap-1 min-w-[80px]"
        >
          <FileBarChart className="h-4 w-4" />
          <span className="text-xs">Reports</span>
        </Button>
      </div>
    </div>
  );
};
