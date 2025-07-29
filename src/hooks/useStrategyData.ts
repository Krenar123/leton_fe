import { useState, useMemo } from "react";
import { Objective, Task } from "@/types/strategy";
import { mockObjectives, mockTasks } from "@/data/mockStrategyData";
import { calculateStatusFromDates } from "@/utils/statusCalculator";

interface UseStrategyDataReturn {
  objectives: Objective[];
  tasks: Task[];
  selectedObjectiveId: string | null;
  filteredObjectives: Objective[];
  filteredTasks: Task[];
  selectedObjective: Objective | undefined;
  completedObjectives: number;
  totalObjectives: number;
  completedTasks: number;
  totalTasks: number;
  objectiveSearchValue: string;
  taskSearchValue: string;
  setSelectedObjectiveId: (id: string | null) => void;
  setObjectives: (objectives: Objective[] | ((prev: Objective[]) => Objective[])) => void;
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  applyObjectiveFilters: (filters: { field?: string; status?: string; participant?: string }) => void;
  applyTaskFilters: (filters: { task?: string; status?: string; participant?: string }) => void;
  setObjectiveSearch: (search: string) => void;
  setTaskSearch: (search: string) => void;
  updateObjectiveStatus: (id: string, status: Objective['status']) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
}

export const useStrategyData = (): UseStrategyDataReturn => {
  // Initialize with updated statuses based on dates
  const [objectives, setObjectives] = useState<Objective[]>(
    mockObjectives.map(obj => ({
      ...obj,
      status: obj.status === 'Finished' ? 'Finished' : calculateStatusFromDates(obj.start, obj.due)
    }))
  );
  const [tasks, setTasks] = useState<Task[]>(
    mockTasks.map(task => ({
      ...task,
      status: task.status === 'Finished' ? 'Finished' : calculateStatusFromDates(task.start, task.due)
    }))
  );
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>("1");
  const [objectiveFilters, setObjectiveFilters] = useState<{
    field?: string;
    status?: string;
    participant?: string;
  }>({});
  const [taskFilters, setTaskFilters] = useState<{
    task?: string;
    status?: string;
    participant?: string;
  }>({});
  const [objectiveSearchValue, setObjectiveSearchValue] = useState("");
  const [taskSearchValue, setTaskSearchValue] = useState("");

  const filteredObjectives = useMemo(() => {
    return objectives.filter(objective => {
      // Search filter
      if (objectiveSearchValue && !objective.field.toLowerCase().includes(objectiveSearchValue.toLowerCase())) {
        return false;
      }
      // Field filter
      if (objectiveFilters.field && !objective.field.toLowerCase().includes(objectiveFilters.field.toLowerCase())) {
        return false;
      }
      // Status filter
      if (objectiveFilters.status && objective.status !== objectiveFilters.status) {
        return false;
      }
      // Participant filter
      if (objectiveFilters.participant && !objective.participants.some(p => 
        p.toLowerCase().includes(objectiveFilters.participant!.toLowerCase())
      )) {
        return false;
      }
      return true;
    });
  }, [objectives, objectiveFilters, objectiveSearchValue]);

  const filteredTasks = useMemo(() => {
    const objectiveTasks = selectedObjectiveId 
      ? tasks.filter(task => task.objectiveId === selectedObjectiveId)
      : [];

    return objectiveTasks.filter(task => {
      // Search filter
      if (taskSearchValue && !task.task.toLowerCase().includes(taskSearchValue.toLowerCase())) {
        return false;
      }
      // Task filter
      if (taskFilters.task && !task.task.toLowerCase().includes(taskFilters.task.toLowerCase())) {
        return false;
      }
      // Status filter
      if (taskFilters.status && task.status !== taskFilters.status) {
        return false;
      }
      // Participant filter
      if (taskFilters.participant && !task.participants.some(p => 
        p.toLowerCase().includes(taskFilters.participant!.toLowerCase())
      )) {
        return false;
      }
      return true;
    });
  }, [tasks, selectedObjectiveId, taskFilters, taskSearchValue]);

  const selectedObjective = useMemo(() => {
    return objectives.find(obj => obj.id === selectedObjectiveId);
  }, [objectives, selectedObjectiveId]);

  const completedObjectives = useMemo(() => {
    return objectives.filter(obj => obj.status === 'Finished').length;
  }, [objectives]);

  const completedTasks = useMemo(() => {
    const objectiveTasks = selectedObjectiveId 
      ? tasks.filter(task => task.objectiveId === selectedObjectiveId)
      : [];
    return objectiveTasks.filter(task => task.status === 'Finished').length;
  }, [tasks, selectedObjectiveId]);

  const totalObjectives = objectives.length;
  const totalTasks = selectedObjectiveId 
    ? tasks.filter(task => task.objectiveId === selectedObjectiveId).length
    : 0;

  const updateObjectiveStatus = (id: string, status: Objective['status']) => {
    setObjectives(prev => prev.map(obj => 
      obj.id === id ? { ...obj, status } : obj
    ));
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const applyObjectiveFilters = (newFilters: { field?: string; status?: string; participant?: string }) => {
    setObjectiveFilters(newFilters);
  };

  const applyTaskFilters = (newFilters: { task?: string; status?: string; participant?: string }) => {
    setTaskFilters(newFilters);
  };

  const setObjectiveSearch = (search: string) => {
    setObjectiveSearchValue(search);
  };

  const setTaskSearch = (search: string) => {
    setTaskSearchValue(search);
  };

  return {
    objectives,
    tasks,
    selectedObjectiveId,
    filteredObjectives,
    filteredTasks,
    selectedObjective,
    completedObjectives,
    totalObjectives,
    completedTasks,
    totalTasks,
    objectiveSearchValue,
    taskSearchValue,
    setSelectedObjectiveId,
    setObjectives,
    setTasks,
    applyObjectiveFilters,
    applyTaskFilters,
    setObjectiveSearch,
    setTaskSearch,
    updateObjectiveStatus,
    updateTaskStatus,
  };
};
