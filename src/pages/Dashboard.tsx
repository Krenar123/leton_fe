import { DashboardOverviewCards } from "@/components/dashboard/DashboardOverviewCards";
import { CashFlowCard } from "@/components/dashboard/CashFlowCard";
import { DueDatesCard } from "@/components/dashboard/DueDatesCard";
import { NextMeetingCard } from "@/components/dashboard/NextMeetingCard";
import { BackstopsCard } from "@/components/dashboard/BackstopsCard";
const Dashboard = () => {
  return <div className="space-y-6 px-0 mx-[16px] py-0 my-[16px]">
      {/* Top Row - Overview Cards */}
      <DashboardOverviewCards />
      
      {/* Cash Flow Graph - Full Width */}
      <CashFlowCard />
      
      {/* Bottom Row - Due Dates takes 2/3, Meeting and Backstops share 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DueDatesCard />
        </div>
        <div className="space-y-6">
          <NextMeetingCard />
          <BackstopsCard />
        </div>
      </div>
    </div>;
};
export default Dashboard;