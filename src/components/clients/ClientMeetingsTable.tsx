
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ClientMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  attendees: string[];
  project?: string;
  location?: string;
  ourPersons?: string[];
}

interface ClientMeetingsTableProps {
  meetings: ClientMeeting[];
  searchTerm: string;
  meetingColumns: {
    ourPersons: boolean;
    description: boolean;
    project: boolean;
    location: boolean;
    date: boolean;
    time: boolean;
  };
}

export const ClientMeetingsTable = ({
  meetings,
  searchTerm,
  meetingColumns
}: ClientMeetingsTableProps) => {
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
            {meetingColumns.project && <TableHead className="font-semibold text-sm w-[180px]">Project</TableHead>}
            {meetingColumns.ourPersons && <TableHead className="font-semibold text-sm w-[150px]">Our Persons</TableHead>}
            {meetingColumns.description && <TableHead className="font-semibold text-sm w-[200px]">Description</TableHead>}
            {meetingColumns.location && <TableHead className="font-semibold text-sm w-[150px]">Location</TableHead>}
            {meetingColumns.date && <TableHead className="font-semibold text-sm w-[120px]">Date</TableHead>}
            {meetingColumns.time && <TableHead className="font-semibold text-sm w-[100px]">Time</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings
            .filter(meeting => 
              meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (meeting.project && meeting.project.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((meeting) => (
            <TableRow key={meeting.id} className="hover:bg-slate-50">
              {meetingColumns.project && <TableCell className="font-bold text-sm">{meeting.project || '-'}</TableCell>}
              {meetingColumns.ourPersons && <TableCell className="text-sm text-gray-600">{meeting.ourPersons?.join(', ') || meeting.attendees.join(', ')}</TableCell>}
              {meetingColumns.description && <TableCell className="text-sm text-gray-600">{meeting.title}</TableCell>}
              {meetingColumns.location && <TableCell className="text-sm text-gray-600">{meeting.location || '-'}</TableCell>}
              {meetingColumns.date && <TableCell className="text-sm text-gray-600">{formatDate(meeting.date)}</TableCell>}
              {meetingColumns.time && <TableCell className="text-sm text-gray-600">{meeting.time}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
