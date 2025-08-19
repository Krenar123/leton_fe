// src/services/api.ts

const API_BASE_URL = "http://localhost:3000/api/v1";

// Utility function for GET requests
async function fetchFromApi(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }

  return response.json();
}

// --------------------
// Project-related APIs
// --------------------

export async function fetchAllProjects() {
  return fetchFromApi("/projects");
}

export async function fetchProjectById(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}`);
}

export async function fetchObjectivesByProject(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/objectives`);
}


export async function fetchStrategyObjectives(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/objectives`);
}

export async function createObjective(projectRef: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/objectives`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ objective: data })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to create objective");
  }

  return response.json();
}

export async function updateObjective(projectRef: string, objectiveRef: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/objectives/${objectiveRef}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ objective: data })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to update objective");
  }

  return response.json();
}

export async function deleteObjective(projectRef: string, objectiveRef: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/objectives/${objectiveRef}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to delete objective");
  }

  return response.json();
}

export async function createTask(projectRef: string, objectiveRef: string, taskData: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/objectives/${objectiveRef}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: taskData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create task");
  }

  return response.json();
}

export async function updateTask(projectRef: string, objectiveRef: string, taskRef: string, taskData: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/objectives/${objectiveRef}/tasks/${taskRef}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: taskData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update task");
  }

  return response.json();
}

export async function deleteTask(projectRef: string, objectiveRef: string, taskRef: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/objectives/${objectiveRef}/tasks/${taskRef}`, {
    method: "DELETE" 
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete task");
  }
}


export async function fetchTasks(projectRef: string, objectiveRef: string) {
  return fetchFromApi(`/projects/${projectRef}/objectives/${objectiveRef}/tasks`);
}

export async function createProject(projectData: any) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(projectData)
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
}

export async function updateProject(ref: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${ref}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ project: data })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to update project");
  }

  return response.json();
}

export async function fetchItemLines(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/item_lines`);
}

export async function createItemLine(projectRef: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/item_lines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_line: data })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to create item line");
  }

  return response.json();
}

export async function updateItemLine(projectRef: string, ref: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/item_lines/${ref}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item_line: data })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to update item line");
  }

  return response.json();
}

export async function deleteItemLine(projectRef: string, ref: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/item_lines/${ref}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to delete item line");
  }

  return response.json();
}

export async function completeItemLine(projectRef: string, ref: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/item_lines/${ref}/complete`, {
    method: "POST"
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to complete item line");
  }

  return response.json();
}



// --------------------
// Client-related APIs
// --------------------

export async function fetchClients() {
  return fetchFromApi("/clients");
}

export async function fetchClientByRef(clientRef: string) {
  return fetchFromApi(`/clients/${clientRef}`);
}

export async function fetchClientProjects(clientRef: string) {
  return fetchFromApi(`/clients/${clientRef}/projects`);
}

export async function fetchClientBills(clientRef: string) {
  return fetchFromApi(`/clients/${clientRef}/invoices`);
}

export async function fetchClientMeetings(clientRef: string) {
  return fetchFromApi(`/clients/${clientRef}/meetings`);
}

export async function createClient(clientData: any) {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ client: clientData }) // wrap in `client:` as Rails expects
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to create client");
  }

  return response.json();
}


// --------------------
// Team-related APIs
// --------------------

export async function fetchUsers() {
  return fetchFromApi("/users");
}

// --------------------
// Supplier-related APIs
// --------------------

export async function fetchSuppliers() {
  return fetchFromApi("/suppliers");
}

export async function fetchSupplierByRef(supplierRef: string) {
  return fetchFromApi(`/suppliers/${supplierRef}`);
}

export async function fetchSupplierProjects(supplierRef: string) {
  return fetchFromApi(`/suppliers/${supplierRef}/projects`);
}

export async function fetchSupplierInvoices(supplierRef: string) {
  return fetchFromApi(`/suppliers/${supplierRef}/invoices`);
}

export async function fetchSupplierBills(supplierRef: string) {
  return fetchFromApi(`/suppliers/${supplierRef}/bills`);
}

export async function fetchSupplierMeetings(supplierRef: string) {
  return fetchFromApi(`/suppliers/${supplierRef}/meetings`);
}


// --------------------
// Item Line & Financial APIs
// --------------------

//export async function fetchItemLines() {
//  return fetchFromApi("/item_lines");
//}

export async function fetchCashFlow() {
  return fetchFromApi("/cash_flow_entries");
}
