import { TeamMemberCard } from "./TeamMemberCard";
interface TeamMember {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
}
interface TeamGridProps {
  members: TeamMember[];
  onMemberClick: (memberId: number) => void;
}
export const TeamGrid = ({
  members,
  onMemberClick
}: TeamGridProps) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-[16px]">
      {members.map(member => <TeamMemberCard key={member.id} member={member} onClick={onMemberClick} />)}
    </div>;
};