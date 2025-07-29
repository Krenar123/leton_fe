
import { Card } from "@/components/ui/card";
import { AlertTriangle, Calendar, PenTool, FileText, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MiddleColumnCardsProps {
  hasNewBackstops: boolean;
  reachedBackstops: number;
  hasNewNotes: boolean;
  viewedNotes: boolean;
  hasNewDocuments: boolean;
  viewedDocuments: boolean;
  newDocumentsCount: number;
  totalDocumentsCount: number;
  hasNewContacts: boolean;
  viewedContacts: boolean;
  newContactsCount: number;
  totalContactsCount: number;
  onBackstopsClick: () => void;
  onMeetingsClick: () => void;
  onNotesClick: () => void;
  onDocumentsClick: () => void;
  onContactsClick: () => void;
}

export const MiddleColumnCards = ({
  hasNewBackstops,
  reachedBackstops,
  hasNewNotes,
  viewedNotes,
  hasNewDocuments,
  viewedDocuments,
  newDocumentsCount,
  totalDocumentsCount,
  hasNewContacts,
  viewedContacts,
  newContactsCount,
  totalContactsCount,
  onBackstopsClick,
  onMeetingsClick,
  onNotesClick,
  onDocumentsClick,
  onContactsClick
}: MiddleColumnCardsProps) => {
  return (
    <div className="space-y-3">
      {/* Backstops - Using same gradient as dashboard BackstopsCard */}
      <Card 
        className={`p-4 bg-gradient-to-br from-blue-900 to-blue-950 text-white cursor-pointer hover:from-blue-800 hover:to-blue-900 transition-all ${
          hasNewBackstops ? 'animate-pulse border-2 border-blue-400' : ''
        }`}
        onClick={onBackstopsClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-white" />
            <h4 className="font-medium text-white">Backstops</h4>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-white">{reachedBackstops}</span>
            <p className="text-xs text-blue-200">reached</p>
          </div>
        </div>
      </Card>

      {/* Meetings */}
      <Card className="p-4 bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors" onClick={onMeetingsClick}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-slate-400" />
            <div className="flex-1">
              <h4 className="font-medium text-slate-800">Meetings</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>Client Review</span>
                  <span>Today 14:00</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>Team Standup</span>
                  <span>Tomorrow 09:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card 
        className={`p-4 bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors ${
          hasNewNotes && !viewedNotes ? 'animate-pulse' : ''
        }`}
        onClick={onNotesClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PenTool className="w-5 h-5 text-slate-400" />
            <div>
              <h4 className="font-medium text-slate-800">Notes</h4>
              <p className="text-sm text-slate-700">Recent updates</p>
            </div>
          </div>
          {hasNewNotes && !viewedNotes && (
            <Badge variant="default" className="text-xs">
              3 new
            </Badge>
          )}
        </div>
      </Card>

      {/* Documents */}
      <Card 
        className={`p-4 bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors ${
          hasNewDocuments && !viewedDocuments ? 'animate-pulse' : ''
        }`}
        onClick={onDocumentsClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-slate-400" />
            <div>
              <h4 className="font-medium text-slate-800">Documents</h4>
              <p className="text-sm text-slate-700">{totalDocumentsCount} files</p>
            </div>
          </div>
          {hasNewDocuments && !viewedDocuments && newDocumentsCount > 0 && (
            <Badge variant="default" className="text-xs">
              {newDocumentsCount} new
            </Badge>
          )}
        </div>
      </Card>

      {/* Contacts */}
      <Card 
        className={`p-4 bg-blue-50 border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors ${
          hasNewContacts && !viewedContacts ? 'animate-pulse' : ''
        }`}
        onClick={onContactsClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-slate-400" />
            <div>
              <h4 className="font-medium text-slate-800">Contacts</h4>
              <p className="text-sm text-slate-700">{totalContactsCount} contacts</p>
            </div>
          </div>
          {hasNewContacts && !viewedContacts && newContactsCount > 0 && (
            <Badge variant="default" className="text-xs">
              {newContactsCount} new
            </Badge>
          )}
        </div>
      </Card>
    </div>
  );
};
