
import { Card } from "@/components/ui/card";
import { Calendar, Menu } from "lucide-react";
import { useState } from "react";
import { MeetingsListDialog } from "./MeetingsListDialog";

export const NextMeetingCard = () => {
  const [isMeetingsDialogOpen, setIsMeetingsDialogOpen] = useState(false);

  // Mock data for next meeting - simplified
  const nextMeeting = {
    withWho: "John Smith",
    date: "2025-07-12",
    time: "14:00"
  };

  const handleCardClick = () => {
    setIsMeetingsDialogOpen(true);
  };

  return (
    <>
      <Card 
        className="p-6 bg-gradient-to-br from-sky-50 to-sky-100 text-slate-900 cursor-pointer hover:from-sky-100 hover:to-sky-200 transition-all relative"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Next Meetings
          </h3>
        </div>
        
        <div className="space-y-2">
          <div className="font-medium text-sm text-slate-900">
            With: {nextMeeting.withWho}
          </div>
          <div className="text-sm text-slate-600">
            {nextMeeting.date} at {nextMeeting.time}
          </div>
        </div>

        <Menu 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer" 
          style={{ color: '#0a1f44' }}
        />
      </Card>

      <MeetingsListDialog
        isOpen={isMeetingsDialogOpen}
        onClose={() => setIsMeetingsDialogOpen(false)}
      />
    </>
  );
};
