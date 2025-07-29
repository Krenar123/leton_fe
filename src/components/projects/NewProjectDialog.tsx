
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Project {
  id: number;
  name: string;
  client: string;
  location: string;
  start: string;
  due: string;
  value: number;
  profitability: number;
  status: "Active" | "Completed";
  description?: string;
}

interface NewProjectDialogProps {
  projects: Project[];
  onProjectCreate: (project: Project) => void;
  onClose: () => void;
}

// Mock existing clients data
const existingClients = [
  {
    id: 1,
    name: "ABC Corp",
    contactPerson: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "john@abccorp.com"
  },
  {
    id: 2,
    name: "XYZ Holdings",
    contactPerson: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    email: "sarah@xyzholdings.com"
  },
  {
    id: 3,
    name: "Retail Partners",
    contactPerson: "Mike Davis",
    phone: "+1 (555) 456-7890",
    email: "mike@retailpartners.com"
  },
  {
    id: 4,
    name: "Health Systems Inc",
    contactPerson: "Dr. Lisa Wilson",
    phone: "+1 (555) 321-0987",
    email: "lisa@healthsystems.com"
  }
];

const NewProjectDialog = ({ projects, onProjectCreate, onClose }: NewProjectDialogProps) => {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    start: "",
    due: "",
    value: "",
    location: ""
  });

  const [clientInfo, setClientInfo] = useState({
    client: "",
    contactPerson: "",
    phone: "",
    email: "",
    isExistingClient: false
  });

  const handleExistingClientSelect = (clientId: string) => {
    const selectedClient = existingClients.find(c => c.id.toString() === clientId);
    if (selectedClient) {
      setClientInfo({
        client: selectedClient.name,
        contactPerson: selectedClient.contactPerson,
        phone: selectedClient.phone,
        email: selectedClient.email,
        isExistingClient: true
      });
    }
  };

  const handleNewClientToggle = () => {
    setClientInfo({
      client: "",
      contactPerson: "",
      phone: "",
      email: "",
      isExistingClient: false
    });
  };

  const handleCreateProject = () => {
    if (!newProject.name || !clientInfo.client) {
      toast({
        title: "Error",
        description: "Please fill in required fields (Project Name and Client)",
        variant: "destructive"
      });
      return;
    }

    const project: Project = {
      id: Math.max(...projects.map(p => p.id)) + 1,
      name: newProject.name,
      client: clientInfo.client,
      location: newProject.location,
      start: newProject.start,
      due: newProject.due,
      value: parseFloat(newProject.value) || 0,
      profitability: 0,
      status: "Active",
      description: newProject.description
    };

    onProjectCreate(project);
    
    // Reset form
    setNewProject({
      name: "",
      description: "",
      start: "",
      due: "",
      value: "",
      location: ""
    });
    setClientInfo({
      client: "",
      contactPerson: "",
      phone: "",
      email: "",
      isExistingClient: false
    });
    
    onClose();
    
    toast({
      title: "Success",
      description: "New project created successfully"
    });
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-8 py-4">
        {/* Project Information Section */}
        <div className="space-y-4">
          <div className="border-b pb-2 mb-4">
            <h3 className="text-lg font-medium">Project Information</h3>
          </div>
          
          <div>
            <label className="text-sm font-medium">Project Name *</label>
            <Input
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              placeholder="Enter project name"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Project Description</label>
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Describe the project..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={newProject.start}
                onChange={(e) => setNewProject({...newProject, start: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input
                type="date"
                value={newProject.due}
                onChange={(e) => setNewProject({...newProject, due: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Project Value</label>
            <Input
              type="number"
              value={newProject.value}
              onChange={(e) => setNewProject({...newProject, value: e.target.value})}
              placeholder="Project value"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input
              value={newProject.location}
              onChange={(e) => setNewProject({...newProject, location: e.target.value})}
              placeholder="Project location"
            />
          </div>
        </div>

        {/* Client Information Section */}
        <div className="space-y-4">
          <div className="border-b pb-2 mb-4">
            <h3 className="text-lg font-medium">Client Information</h3>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={!clientInfo.isExistingClient ? "default" : "outline"}
              size="sm"
              onClick={handleNewClientToggle}
              style={!clientInfo.isExistingClient ? { backgroundColor: '#0a1f44' } : {}}
              className={!clientInfo.isExistingClient ? "hover:opacity-90" : ""}
            >
              New Client
            </Button>
            <Button
              type="button"
              variant={clientInfo.isExistingClient ? "default" : "outline"}
              size="sm"
              onClick={() => setClientInfo({...clientInfo, isExistingClient: true})}
              style={clientInfo.isExistingClient ? { backgroundColor: '#0a1f44' } : {}}
              className={clientInfo.isExistingClient ? "hover:opacity-90" : ""}
            >
              Existing Client
            </Button>
          </div>

          {clientInfo.isExistingClient ? (
            <div>
              <label className="text-sm font-medium">Select Client *</label>
              <Select onValueChange={handleExistingClientSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose existing client" />
                </SelectTrigger>
                <SelectContent>
                  {existingClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium">Client Name *</label>
              <Input
                value={clientInfo.client}
                onChange={(e) => setClientInfo({...clientInfo, client: e.target.value})}
                placeholder="Client name or company"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Contact Person</label>
            <Input
              value={clientInfo.contactPerson}
              onChange={(e) => setClientInfo({...clientInfo, contactPerson: e.target.value})}
              placeholder="Contact person name"
              disabled={clientInfo.isExistingClient}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              type="tel"
              value={clientInfo.phone}
              onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
              placeholder="Phone number"
              disabled={clientInfo.isExistingClient}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={clientInfo.email}
              onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
              placeholder="Email address"
              disabled={clientInfo.isExistingClient}
            />
          </div>

          {clientInfo.isExistingClient && clientInfo.client && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Selected Client Details:</p>
              <div className="space-y-1 text-sm">
                <p><strong>Client:</strong> {clientInfo.client}</p>
                {clientInfo.contactPerson && <p><strong>Contact:</strong> {clientInfo.contactPerson}</p>}
                {clientInfo.phone && <p><strong>Phone:</strong> {clientInfo.phone}</p>}
                {clientInfo.email && <p><strong>Email:</strong> {clientInfo.email}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleCreateProject}
          style={{ backgroundColor: '#d9a44d' }}
          className="hover:opacity-90"
        >
          Create Project
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default NewProjectDialog;
