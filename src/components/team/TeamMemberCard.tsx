import { Card, CardContent } from "@/components/ui/card";
interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
}
interface TeamMemberCardProps {
  member: TeamMember;
  onClick: (memberId: number) => void;
}
export const TeamMemberCard = ({
  member,
  onClick
}: TeamMemberCardProps) => {
  return <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(member.id)}>
      <CardContent className="p-6 bg-slate-100 bg-[E6ECEF] rounded">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold text-lg bg-[#0a1f44]">
            {member.avatar}
          </div>

          {/* Name and Position */}
          <div className="space-y-1">
            <h3 className="font-semibold text-slate-900">{member.name}</h3>
            <p className="text-sm text-slate-600">{member.position}</p>
            <p className="text-xs text-slate-500">{member.department}</p>
          </div>
        </div>
      </CardContent>
    </Card>;
};