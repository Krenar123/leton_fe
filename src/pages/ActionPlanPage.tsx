import { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectData } from "@/hooks/useProjectData";
import { StrategyTab } from "@/components/action-plan/StrategyTab";
import { ItemLinesTab } from "@/components/action-plan/ItemLinesTab";
import { GanttTab } from "@/components/action-plan/GanttTab";
const ActionPlanPage = () => {
  const {
    id
  } = useParams();
  const {
    project
  } = useProjectData(id || "");
  if (!project) {
    return <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      <Tabs defaultValue="strategy" className="w-full mx-[16px] my-[16px]">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
          <TabsTrigger value="strategy" className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-[#0a1f44] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
            Strategy
          </TabsTrigger>
          <TabsTrigger value="itemlines" className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-[#0a1f44] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
            Item Lines
          </TabsTrigger>
          <TabsTrigger value="gantt" className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:bg-[#0a1f44] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all">
            Gantt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategy" className="mt-6">
          <StrategyTab project={project} />
        </TabsContent>

        <TabsContent value="itemlines" className="mt-6">
          <ItemLinesTab project={project} />
        </TabsContent>

        <TabsContent value="gantt" className="mt-6">
          <GanttTab project={project} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default ActionPlanPage;