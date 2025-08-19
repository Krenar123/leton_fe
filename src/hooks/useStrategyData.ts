import { useQuery } from "@tanstack/react-query";
import { calculateStatusFromDates } from "@/utils/statusCalculator";
import { fetchStrategyObjectives, fetchTasks } from "@/services/api";
import { Objective } from "@/types/objective";
import { Task } from "@/types/task";
import { useState, useMemo } from "react";
import { mapObjectiveStatusEnum } from "@/utils/mapObjectiveStatusEnum";

export const useStrategyData = (projectRef: string, selectedObjectiveId: string | null) => {
  const [objectiveSearchValue, setObjectiveSearchValue] = useState("");
  const [taskSearchValue, setTaskSearchValue] = useState("");
  const [objectiveFilters, setObjectiveFilters] = useState({});
  const [taskFilters, setTaskFilters] = useState({});

  const { data: objectivesRaw = [], isLoading: isLoadingObjectives, refetch: refetchObjectives } = useQuery({
    queryKey: ["objectives", projectRef],
    queryFn: () => fetchStrategyObjectives(projectRef),
  });
  

  const objectives: Objective[] = objectivesRaw.data?.map((entry: any) => ({
    ref: entry.attributes.ref,
    title: entry.attributes.title,
    description: entry.attributes.description,
    start_date: entry.attributes.start_date,
    end_date: entry.attributes.end_date,
    participants: entry.attributes.participants || [], // populate if your API provides them
    status: mapObjectiveStatusEnum(entry.attributes.status) //calculateStatusFromDates(entry.attributes.start_date, entry.attributes.due_date)
  })) || [];

  const { data: tasksRaw = [], isLoading: isLoadingTasks, refetch: refetchTasks  } = useQuery({
    queryKey: ["tasks", selectedObjectiveId],
    queryFn: () => selectedObjectiveId ? fetchTasks(projectRef, selectedObjectiveId) : Promise.resolve({ data: [] }),
    enabled: !!selectedObjectiveId,
  });

  const tasks: Task[] = tasksRaw.data?.map((entry: any) => ({
    ref: entry.attributes.ref,
    objectiveId: entry.attributes.objective_id,
    title: entry.attributes.title,
    description: entry.attributes.description,
    start_date: entry.attributes.start_date,
    due_date: entry.attributes.due_date,
    participants: entry.attributes.participants || [], // same here
    status: calculateStatusFromDates(entry.attributes.start_date, entry.attributes.due_date),
  })) || [];

  const filteredObjectives = useMemo(() => {
    return objectives.filter(obj => {
      if (objectiveSearchValue && !obj.title.toLowerCase().includes(objectiveSearchValue.toLowerCase())) return false;
      // Add filter checks here
      return true;
    });
  }, [objectives, objectiveSearchValue]);


  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (taskSearchValue && !task.title.toLowerCase().includes(taskSearchValue.toLowerCase())) return false;
      // Add filter checks here
      return true;
    });
  }, [tasks, taskSearchValue]);

  const selectedObjective = objectives.find(obj => obj.ref === selectedObjectiveId);
  const completedObjectives = objectives.filter(obj => obj.status === "completed").length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;

  return {
    isLoadingObjectives,
    isLoadingTasks,
    objectives,
    tasks,
    filteredObjectives,
    filteredTasks,
    selectedObjective,
    completedObjectives,
    totalObjectives: objectives.length,
    completedTasks,
    totalTasks: tasks.length,
    setObjectiveSearchValue,
    setTaskSearchValue,
    setObjectiveFilters,
    setTaskFilters,
    refetchObjectives,
    refetchTasks,
  };
};
