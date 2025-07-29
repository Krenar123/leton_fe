
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Settings } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, parseISO } from "date-fns";
import { Project } from "@/types/project";
import { useFinancialsData } from "@/hooks/useFinancialsData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { StatusIcon } from "@/components/action-plan/StatusIcon";
import { calculateStatusFromDates } from "@/utils/statusCalculator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface GanttChartProps {
  project: Project;
}

type CategoryType = 'itemlines' | 'objectives' | 'tasks';

export const GanttChart = ({ project }: GanttChartProps) => {
  const { estimatesActualsData } = useFinancialsData();
  const { objectives, tasks } = useStrategyData();
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(['itemlines', 'objectives', 'tasks']);

  // Calculate date range for the timeline (current month + next 2 months)
  const currentDate = new Date();
  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() + 2));
  const timelineDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Prepare data for each category
  const ganttData = useMemo(() => {
    const items: Array<{
      id: string;
      name: string;
      category: CategoryType;
      startDate: Date;
      endDate: Date;
      status: 'Planned' | 'In Progress' | 'Finished' | 'Already Due';
    }> = [];

    // Add item lines
    if (selectedCategories.includes('itemlines')) {
      estimatesActualsData.forEach((item, index) => {
        if (item.startDate && item.dueDate) {
          const status = item.status === 'completed' ? 'Finished' : 
            calculateStatusFromDates(item.startDate, item.dueDate);
          
          items.push({
            id: `itemline-${index}`,
            name: item.itemLine,
            category: 'itemlines',
            startDate: parseISO(item.startDate),
            endDate: parseISO(item.dueDate),
            status
          });
        }
      });
    }

    // Add objectives
    if (selectedCategories.includes('objectives')) {
      objectives.forEach(obj => {
        items.push({
          id: `objective-${obj.id}`,
          name: obj.field,
          category: 'objectives',
          startDate: parseISO(obj.start),
          endDate: parseISO(obj.due),
          status: obj.status
        });
      });
    }

    // Add tasks
    if (selectedCategories.includes('tasks')) {
      tasks.forEach(task => {
        items.push({
          id: `task-${task.id}`,
          name: task.task,
          category: 'tasks',
          startDate: parseISO(task.start),
          endDate: parseISO(task.due),
          status: task.status
        });
      });
    }

    return items.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [estimatesActualsData, objectives, tasks, selectedCategories]);

  const getCategoryColor = (category: CategoryType) => {
    switch (category) {
      case 'itemlines': return 'bg-blue-500';
      case 'objectives': return 'bg-green-500';
      case 'tasks': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryBadgeColor = (category: CategoryType) => {
    switch (category) {
      case 'itemlines': return 'bg-blue-100 text-blue-800';
      case 'objectives': return 'bg-green-100 text-green-800';
      case 'tasks': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getItemPosition = (item: typeof ganttData[0]) => {
    const totalDays = timelineDays.length;
    const itemStart = Math.max(0, Math.floor((item.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const itemEnd = Math.min(totalDays, Math.ceil((item.endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const itemDuration = Math.max(1, itemEnd - itemStart);
    
    return {
      left: `${(itemStart / totalDays) * 100}%`,
      width: `${(itemDuration / totalDays) * 100}%`
    };
  };

  const toggleCategory = (category: CategoryType) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const categoryLabels = {
    itemlines: 'Item Lines',
    objectives: 'Objectives', 
    tasks: 'Tasks'
  };

  const hasCustomSelection = selectedCategories.length !== 3;

  return (
    <div className="space-y-6">
      {/* Category Settings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {selectedCategories.map(category => (
            <div key={category} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${getCategoryColor(category)}`} />
              <span className="text-sm text-gray-600">{categoryLabels[category]}</span>
            </div>
          ))}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className={hasCustomSelection ? "text-yellow-600 border-yellow-600 bg-yellow-50" : ""}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Show Categories</h4>
              {(Object.keys(categoryLabels) as CategoryType[]).map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label htmlFor={category} className="text-sm font-normal">
                    {categoryLabels[category]}
                  </label>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Gantt Chart */}
      <Card className="p-6">
        {ganttData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h4 className="font-medium mb-2">No Data to Display</h4>
            <p className="text-sm">Select categories or add items with dates to see the Gantt chart.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timeline Header */}
            <div className="relative h-16 border-b">
              <div className="flex h-8 border-b">
                {Array.from(new Set(timelineDays.map(day => format(day, 'MMM yyyy')))).map((month, index) => {
                  const monthDays = timelineDays.filter(day => format(day, 'MMM yyyy') === month);
                  const width = (monthDays.length / timelineDays.length) * 100;
                  
                  return (
                    <div key={index} className="flex items-center justify-center border-r text-sm font-medium" style={{ width: `${width}%` }}>
                      {month}
                    </div>
                  );
                })}
              </div>
              <div className="flex h-8">
                {timelineDays.map((day, index) => (
                  <div key={index} className="flex items-center justify-center border-r text-xs text-gray-500" style={{ width: `${100 / timelineDays.length}%` }}>
                    {format(day, 'd')}
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt Items */}
            <div className="space-y-3">
              {ganttData.map((item) => {
                const position = getItemPosition(item);
                
                return (
                  <div key={item.id} className="relative h-12 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center h-full">
                      <div className="w-64 pr-4 flex items-center gap-2">
                        <StatusIcon status={item.status} className="w-4 h-4" />
                        <span className="text-sm font-medium truncate">{item.name}</span>
                        <Badge className={`text-xs ${getCategoryBadgeColor(item.category)}`}>
                          {categoryLabels[item.category]}
                        </Badge>
                      </div>
                      <div className="flex-1 relative">
                        <div 
                          className={`absolute top-3 h-6 rounded ${getCategoryColor(item.category)} opacity-80 flex items-center px-2`}
                          style={position}
                        >
                          <span className="text-white text-xs font-medium truncate">
                            {format(item.startDate, 'MMM d')} - {format(item.endDate, 'MMM d')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
