import { useEffect, useState } from "react";
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
import { createProject, fetchClients, createClient } from "@/services/api";

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

const NewProjectDialog = ({ projects, onProjectCreate, onClose }: NewProjectDialogProps) => {
  const [existingClients, setExistingClients] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    start: "",
    due: "",
    value: "",
    location: ""
  });

  const [clientInfo, setClientInfo] = useState({
    clientId: "",
    client: "",
    contactPerson: "",
    phone: "",
    email: "",
    isExistingClient: false
  });

  useEffect(() => {
    const loadClients = async () => {
      setLoadingClients(true);
      try {
        const res = await fetchClients();
        setExistingClients(res.data.map((c: any) => ({
          id: c.id,
          name: c.attributes.company,
          contactPerson: c.attributes.contact_person,
          phone: c.attributes.phone,
          email: c.attributes.email
        })));
      } catch (e) {
        console.error("Failed to fetch clients", e);
      } finally {
        setLoadingClients(false);
      }
    };

    loadClients();
  }, []);

  const handleExistingClientSelect = (clientId: string) => {
    const selectedClient = existingClients.find(c => c.id.toString() === clientId);
    if (selectedClient) {
      setClientInfo({
        clientId,
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
      clientId: "",
      client: "",
      contactPerson: "",
      phone: "",
      email: "",
      isExistingClient: false
    });
  };

  const handleCreateProject = async () => {
    if (!newProject.name || (!clientInfo.clientId && !clientInfo.client)) {
      toast({
        title: "Error",
        description: "Please fill in required fields (Project Name and Client)",
        variant: "destructive"
      });
      return;
    }

    try {
      let clientId = clientInfo.clientId;

      if (!clientId) {
        const newClient = {
          company: clientInfo.client,
          contact_name: clientInfo.contactPerson,
          phone: clientInfo.phone,
          email: clientInfo.email
        };
        const clientResponse = await createClient(newClient);
        clientId = clientResponse.data.id;
      }

      const payload = {
        name: newProject.name,
        description: newProject.description,
        client_id: parseInt(clientId),
        status: "planning",
        start_date: newProject.start,
        end_date: newProject.due,
        budget: parseFloat(newProject.value),
        location: newProject.location,
        project_manager_id: null
      };

      const response = await createProject(payload);
      const created = response.data.attributes;
      onProjectCreate(created);
      onClose();
      toast({ title: "Success", description: "New project created successfully" });
    } catch (error) {
      console.error("Error creating project", error);
      toast({ title: "Error", description: "Failed to create project", variant: "destructive" });
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-8 py-4">
        <div className="space-y-4">
          <div className="border-b pb-2 mb-4"><h3 className="text-lg font-medium">Project Information</h3></div>
          <div><label className="text-sm font-medium">Project Name *</label><Input value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} placeholder="Enter project name" /></div>
          <div><label className="text-sm font-medium">Project Description</label><Textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} placeholder="Describe the project..." rows={3} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Start Date</label><Input type="date" value={newProject.start} onChange={(e) => setNewProject({...newProject, start: e.target.value})} /></div>
            <div><label className="text-sm font-medium">Due Date</label><Input type="date" value={newProject.due} onChange={(e) => setNewProject({...newProject, due: e.target.value})} /></div>
          </div>
          <div><label className="text-sm font-medium">Project Value</label><Input type="number" value={newProject.value} onChange={(e) => setNewProject({...newProject, value: e.target.value})} placeholder="Project value" /></div>
          <div><label className="text-sm font-medium">Location</label><Input value={newProject.location} onChange={(e) => setNewProject({...newProject, location: e.target.value})} placeholder="Project location" /></div>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-2 mb-4"><h3 className="text-lg font-medium">Client Information</h3></div>
          <div className="flex gap-2 mb-4">
            <Button type="button" variant={!clientInfo.isExistingClient ? "default" : "outline"} size="sm" onClick={handleNewClientToggle} style={!clientInfo.isExistingClient ? { backgroundColor: '#0a1f44' } : {}} className={!clientInfo.isExistingClient ? "hover:opacity-90" : ""}>New Client</Button>
            <Button type="button" variant={clientInfo.isExistingClient ? "default" : "outline"} size="sm" onClick={() => setClientInfo({...clientInfo, isExistingClient: true})} style={clientInfo.isExistingClient ? { backgroundColor: '#0a1f44' } : {}} className={clientInfo.isExistingClient ? "hover:opacity-90" : ""}>Existing Client</Button>
          </div>

          {clientInfo.isExistingClient ? (
            <div>
              <label className="text-sm font-medium">Select Client *</label>
              <Select onValueChange={handleExistingClientSelect}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingClients ? "Loading clients..." : "Choose existing client"} />
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
            <div><label className="text-sm font-medium">Client Name *</label><Input value={clientInfo.client} onChange={(e) => setClientInfo({...clientInfo, client: e.target.value})} placeholder="Client name or company" /></div>
          )}

          <div><label className="text-sm font-medium">Contact Person</label><Input value={clientInfo.contactPerson} onChange={(e) => setClientInfo({...clientInfo, contactPerson: e.target.value})} placeholder="Contact person name" disabled={clientInfo.isExistingClient} /></div>
          <div><label className="text-sm font-medium">Phone Number</label><Input type="tel" value={clientInfo.phone} onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})} placeholder="Phone number" disabled={clientInfo.isExistingClient} /></div>
          <div><label className="text-sm font-medium">Email</label><Input type="email" value={clientInfo.email} onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})} placeholder="Email address" disabled={clientInfo.isExistingClient} /></div>
          {clientInfo.isExistingClient && clientInfo.client && (
            <div className="bg-gray-50 p-3 rounded-lg"><p className="text-sm text-gray-600 mb-2">Selected Client Details:</p><div className="space-y-1 text-sm"><p><strong>Client:</strong> {clientInfo.client}</p>{clientInfo.contactPerson && <p><strong>Contact:</strong> {clientInfo.contactPerson}</p>}{clientInfo.phone && <p><strong>Phone:</strong> {clientInfo.phone}</p>}{clientInfo.email && <p><strong>Email:</strong> {clientInfo.email}</p>}</div></div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreateProject} style={{ backgroundColor: '#d9a44d' }} className="hover:opacity-90">Create Project</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default NewProjectDialog;
