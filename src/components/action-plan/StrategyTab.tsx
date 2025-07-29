import { useState } from "react";
import { Project } from "@/types/project";
import { Objective, Task } from "@/types/strategy";
import { AddObjectiveDialog } from "./AddObjectiveDialog";
import { AddTaskDialog } from "./AddTaskDialog";
import { EditObjectiveDialog } from "./EditObjectiveDialog";
import { EditTaskDialog } from "./EditTaskDialog";
import { ObjectivesSection } from "./ObjectivesSection";
import { TasksSection } from "./TasksSection";
import { useStrategyData } from "@/hooks/useStrategyData";

interface StrategyTabProps {
  project: Project;
}

export const StrategyTab = ({ project }: StrategyTabProps) => {
  const [isAddObjectiveDialogOpen, setIsAddObjectiveDialogOpen] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditObjectiveDialogOpen, setIsEditObjectiveDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const {
    objectives,
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
  } = useStrategyData();

  const handleAddObjective = (newObjective: Omit<Objective, 'id'>) => {
    const objective: Objective = {
      ...newObjective,
      id: Date.now().toString()
    };
    setObjectives(prev => [...prev, objective]);
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, task]);
  };

  const handleObjectiveSelect = (id: string) => {
    setSelectedObjectiveId(id);
  };

  const handleEditObjective = (objective: Objective) => {
    setEditingObjective(objective);
    setIsEditObjectiveDialogOpen(true);
  };

  const handleSaveObjective = (updatedObjective: Objective) => {
    setObjectives(prev => prev.map(obj => 
      obj.id === updatedObjective.id ? updatedObjective : obj
    ));
    setEditingObjective(null);
  };

  const handleDeleteObjective = (id: string) => {
    setObjectives(prev => prev.filter(obj => obj.id !== id));
    if (selectedObjectiveId === id) {
      setSelectedObjectiveId(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditTaskDialogOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ObjectivesSection
        objectives={filteredObjectives}
        selectedObjectiveId={selectedObjectiveId}
        selectedObjective={selectedObjective}
        completedObjectives={completedObjectives}
        totalObjectives={totalObjectives}
        searchValue={objectiveSearchValue}
        onObjectiveSelect={handleObjectiveSelect}
        onFilterChange={applyObjectiveFilters}
        onSearchChange={setObjectiveSearch}
        onAddObjective={() => setIsAddObjectiveDialogOpen(true)}
        onEditObjective={handleEditObjective}
        onDeleteObjective={handleDeleteObjective}
        onStatusChange={updateObjectiveStatus}
      />

      <TasksSection
        tasks={filteredTasks}
        selectedObjective={selectedObjective}
        selectedObjectiveId={selectedObjectiveId}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
        searchValue={taskSearchValue}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onFilterChange={applyTaskFilters}
        onSearchChange={setTaskSearch}
        onAddTask={() => setIsAddTaskDialogOpen(true)}
        onStatusChange={updateTaskStatus}
      />

      <AddObjectiveDialog
        open={isAddObjectiveDialogOpen}
        onOpenChange={setIsAddObjectiveDialogOpen}
        onAdd={handleAddObjective}
      />

      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onOpenChange={setIsAddTaskDialogOpen}
        onAdd={handleAddTask}
        objectiveId={selectedObjectiveId || ""}
      />

      <EditObjectiveDialog
        open={isEditObjectiveDialogOpen}
        onOpenChange={setIsEditObjectiveDialogOpen}
        onSave={handleSaveObjective}
        objective={editingObjective}
      />

      <EditTaskDialog
        open={isEditTaskDialogOpen}
        onOpenChange={setIsEditTaskDialogOpen}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};
