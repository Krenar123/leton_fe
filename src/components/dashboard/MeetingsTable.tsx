
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Meeting, MeetingsTableSettings } from "./types/meetings";

interface MeetingsTableProps {
  meetings: Meeting[];
  settings: MeetingsTableSettings;
  onClose: () => void;
}

export const MeetingsTable = ({ meetings, settings, onClose }: MeetingsTableProps) => {
  const navigate = useNavigate();

  const handleRowClick = (meeting: Meeting) => {
    navigate(`/projects/${meeting.projectId}`);
    onClose();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">Company</TableHead>
            {settings.showName && <TableHead className="font-semibold">Person</TableHead>}
            {settings.showOurPersons && <TableHead className="font-semibold">Our Persons</TableHead>}
            {settings.showDescription && <TableHead className="font-semibold">Description</TableHead>}
            {settings.showProject && <TableHead className="font-semibold">Project</TableHead>}
            {settings.showLocation && <TableHead className="font-semibold">Location</TableHead>}
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <TableRow 
              key={meeting.id} 
              className="hover:bg-gray-50/50 cursor-pointer"
              onClick={() => handleRowClick(meeting)}
            >
              <TableCell className="font-medium">{meeting.companyName}</TableCell>
              {settings.showName && (
                <TableCell className="text-gray-600">{meeting.name}</TableCell>
              )}
              {settings.showOurPersons && (
                <TableCell className="text-gray-600">
                  {meeting.ourPersons.join(", ")}
                </TableCell>
              )}
              {settings.showDescription && (
                <TableCell className="text-gray-600">{meeting.description}</TableCell>
              )}
              {settings.showProject && (
                <TableCell className="text-gray-600">{meeting.project}</TableCell>
              )}
              {settings.showLocation && (
                <TableCell className="text-gray-600">{meeting.location}</TableCell>
              )}
              <TableCell className="font-medium">{formatDate(meeting.date)}</TableCell>
              <TableCell className="font-medium">{meeting.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
