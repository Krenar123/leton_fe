import { useState } from "react";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { Objective } from "@/types/objective";
import { AddObjectiveDialog } from "./AddObjectiveDialog";
import { AddTaskDialog } from "./AddTaskDialog";
import { EditObjectiveDialog } from "./EditObjectiveDialog";
import { EditTaskDialog } from "./EditTaskDialog";
import { ObjectivesSection } from "./ObjectivesSection";
import { TasksSection } from "./TasksSection";
import { useStrategyData } from "@/hooks/useStrategyData";
import { createObjective, updateObjective, deleteObjective,
  createTask, updateTask, deleteTask
 } from "@/services/api";
import { toast } from "@/hooks/use-toast";

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
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);

  const {
    objectives,
    tasks,
    filteredObjectives,
    filteredTasks,
    selectedObjective,
    completedObjectives,
    totalObjectives,
    completedTasks,
    totalTasks,
    objectiveSearchValue,
    taskSearchValue,
    setObjectiveSearchValue,
    setTaskSearchValue,
    setObjectiveFilters,
    setTaskFilters,
    refetchObjectives,
    refetchTasks
  } = useStrategyData(project.ref, selectedObjectiveId);

  const handleAddObjective = async (newObjective: Omit<Objective, "id">) => {
    try {
      const statusMap: Record<string, number> = {
        not_started: 0,
        in_progress: 1,
        completed: 2,
        on_hold: 3,
      };
    
      console.log(newObjective);
      
      const payload = {
        title: newObjective.title,
        description: newObjective.description,
        start_date: new Date(newObjective.start_date).toISOString().split("T")[0],
        end_date: new Date(newObjective.end_date).toISOString().split("T")[0],
        participants: newObjective.participants,
        status: statusMap[newObjective.status] ?? 0,
      };

      const response = await createObjective(project.ref, payload);

      toast({ title: "Objective created successfully" });
      await refetchObjectives(); 
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create objective",
        variant: "destructive",
      });
    }
  };

  const handleAddTask = async (newTask: Omit<Task, "id">) => {
    if (!selectedObjectiveId) return;
  
    try {
      const payload = {
        title: newTask.title,
        description: newTask.description,
        start_date: new Date(newTask.start_date).toISOString().split("T")[0],
        due_date: new Date(newTask.start_date).toISOString().split("T")[0],
        participants: newTask.participants,
      };
  
      await createTask(project.ref, selectedObjectiveId, payload);
      toast({ title: "Task created successfully" });
      await refetchTasks(); // Assuming this also refetches tasks
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };
  

  const handleObjectiveSelect = (id: string) => {
    setSelectedObjectiveId(id);
  };

  const handleEditObjective = (objective: Objective) => {
    setEditingObjective(objective);
    setIsEditObjectiveDialogOpen(true);
  };

  const handleSaveObjective = async (updatedObjective: Objective) => {
    try {
      const payload = {
        title: updatedObjective.title,
        description: updatedObjective.description,
        start_date: new Date(updatedObjective.start_date).toISOString().split("T")[0],
        end_date: new Date(updatedObjective.end_date).toISOString().split("T")[0],
        participants: updatedObjective.participants,
      };
  
      const response = await updateObjective(project.ref, updatedObjective.ref, payload);
      const updated = response.data.attributes;
  
      const newObjective: Objective = {
        ...updatedObjective,
        title: updated.title,
        description: updated.description,
        start_date: updated.start_date,
        end_date: updated.end_date,
        participants: updated.participants,
      };
  
      //setObjectives((prev) =>
      //  prev.map((obj) => (obj.ref === newObjective.ref ? newObjective : obj))
      //);
  
      toast({ title: "Objective updated successfully" });
      await refetchObjectives(); 
    } catch (error: any) {
      console.error("Error updating objective:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update objective",
        variant: "destructive",
      });
    }
  };
    

  const handleDeleteObjective = async (ref: string) => {
    try {
      await deleteObjective(project.ref, ref);
      toast({ title: "Objective deleted successfully" });
  
      if (selectedObjectiveId === ref) {
        setSelectedObjectiveId(null);
      }
  
      await refetchObjectives();
    } catch (error: any) {
      toast({
        title: "Error deleting objective",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditTaskDialogOpen(true);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    if (!selectedObjectiveId) return;
  
    try {
      const payload = {
        title: updatedTask.title,
        description: updatedTask.description,
        start_date: new Date(updatedTask.start_date).toISOString().split("T")[0],
        due_date: new Date(updatedTask.due_date).toISOString().split("T")[0],
        participants: updatedTask.participants,
      };
  
      await updateTask(project.ref, selectedObjectiveId, updatedTask.ref, payload);
      toast({ title: "Task updated successfully" });
      setEditingTask(null);
      await refetchTasks();
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };
  

  const handleDeleteTask = async (taskId: string) => {
    if (!selectedObjectiveId) return;
  
    try {
      await deleteTask(project.ref, selectedObjectiveId, taskId);
      toast({ title: "Task deleted successfully" });
      await refetchObjectives();
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
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
        onFilterChange={setObjectiveFilters}
        onSearchChange={setObjectiveSearchValue}
        onAddObjective={() => setIsAddObjectiveDialogOpen(true)}
        onEditObjective={handleEditObjective}
        onDeleteObjective={handleDeleteObjective}
        onStatusChange={() => {}}
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
        onFilterChange={setTaskFilters}
        onSearchChange={setTaskSearchValue}
        onAddTask={() => setIsAddTaskDialogOpen(true)}
        onStatusChange={() => {}}
      />

      <AddObjectiveDialog
        open={isAddObjectiveDialogOpen}
        onOpenChange={setIsAddObjectiveDialogOpen}
        onAdd={handleAddObjective}
        projectRef={project.ref}
      />

      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onOpenChange={setIsAddTaskDialogOpen}
        onAdd={handleAddTask}
        objectiveRef={selectedObjectiveId || ""}
      />

      <EditObjectiveDialog
        open={isEditObjectiveDialogOpen}
        onOpenChange={setIsEditObjectiveDialogOpen}
        onSave={handleSaveObjective}
        objective={editingObjective}
        projectRef={project.ref}
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
