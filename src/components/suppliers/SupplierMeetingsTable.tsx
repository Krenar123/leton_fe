
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, MapPin, Clock } from "lucide-react";

interface SupplierMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  attendees: string[];
  project?: string;
  location?: string;
  ourPersons?: string[];
}

interface SupplierMeetingsTableProps {
  meetings: SupplierMeeting[];
  searchTerm: string;
  meetingColumns: {
    date: boolean;
    time: boolean;
    attendees: boolean;
    project: boolean;
    location: boolean;
    ourPersons: boolean;
  };
}

export const SupplierMeetingsTable = ({
  meetings,
  searchTerm,
  meetingColumns
}: SupplierMeetingsTableProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold text-sm w-[250px]">Meeting Title</TableHead>
            {meetingColumns.date && <TableHead className="font-semibold text-sm w-[120px]">Date</TableHead>}
            {meetingColumns.time && <TableHead className="font-semibold text-sm w-[100px]">Time</TableHead>}
            {meetingColumns.attendees && <TableHead className="font-semibold text-sm w-[200px]">Attendees</TableHead>}
            {meetingColumns.project && <TableHead className="font-semibold text-sm w-[200px]">Project</TableHead>}
            {meetingColumns.location && <TableHead className="font-semibold text-sm w-[150px]">Location</TableHead>}
            {meetingColumns.ourPersons && <TableHead className="font-semibold text-sm w-[200px]">Our Persons</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings
            .filter(meeting => 
              meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (meeting.project && meeting.project.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (meeting.location && meeting.location.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((meeting) => (
            <TableRow key={meeting.id} className="hover:bg-slate-50">
              <TableCell className="font-medium text-sm">{meeting.title}</TableCell>
              {meetingColumns.date && <TableCell className="text-sm text-gray-600">{formatDate(meeting.date)}</TableCell>}
              {meetingColumns.time && <TableCell className="text-sm text-gray-600">{meeting.time}</TableCell>}
              {meetingColumns.attendees && (
                <TableCell className="text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {meeting.attendees.join(', ')}
                  </div>
                </TableCell>
              )}
              {meetingColumns.project && <TableCell className="text-sm text-gray-600">{meeting.project || '-'}</TableCell>}
              {meetingColumns.location && (
                <TableCell className="text-sm text-gray-600">
                  {meeting.location ? (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {meeting.location}
                    </div>
                  ) : '-'}
                </TableCell>
              )}
              {meetingColumns.ourPersons && (
                <TableCell className="text-sm text-gray-600">
                  {meeting.ourPersons ? meeting.ourPersons.join(', ') : '-'}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
