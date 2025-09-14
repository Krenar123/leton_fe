// src/services/api.ts

const API_BASE_URL = "http://localhost:3000/api/v1";
//const API_BASE_URL = "https://leton-be.onrender.com/api/v1";

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

export async function fetchProjectBills(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/bills`);
}

export async function createBill(projectRef: string, data: {
  item_line_ids: number[];      // optional link to line
  amount: number;
  tax_amount?: number;
  total_amount?: number;
  issue_date?: string;        // yyyy-mm-dd
  due_date?: string;          // yyyy-mm-dd
  status?: string;            // "draft"|"issued"|...
  bill_number?: string;       // FE can generate, BE can also default
}) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectRef}/bills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bill: data }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchProjectInvoices(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/invoices`);
}

export async function createInvoice(projectRef: string, data: {
  item_line_ids: number[];              // required
  amount: number;                     // required
  issue_date?: string;                // "yyyy-mm-dd"
  due_date?: string;                  // "yyyy-mm-dd"
  tax_amount?: number;
  total_amount?: number;              // if you want different than amount + tax
  invoice_number?: string;            // optional, BE can autogen if blank
  status?: string;                    // optional
}) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectRef}/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invoice: data })
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// ---------- Payments ----------
export async function createPaymentForInvoice(projectRef: string, invoiceRef: string, data: {
  amount: number;
  payment_date?: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectRef}/invoices/${invoiceRef}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payment: data }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function createPaymentForBill(projectRef: string, billRef: string, data: {
  amount: number;
  payment_date?: string;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectRef}/bills/${billRef}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payment: data }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}


// ---- Project meetings CRUD ----
export async function fetchProjectMeetings(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/meetings`);
}

export async function createProjectMeeting(projectRef: string, meetingData: any) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectRef}/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meeting: meetingData }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to create project meeting");
  return res.json();
}

export async function updateProjectMeeting(projectRef: string, meetingRef: string, meetingData: any) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectRef}/meetings/${meetingRef}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meeting: meetingData }),
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to update project meeting");
  return res.json();
}

export async function deleteProjectMeeting(projectRef: string, meetingRef: string) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectRef}/meetings/${meetingRef}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Failed to delete project meeting");
  return true;
}

// Project Contact-related APIs
export async function fetchProjectContacts(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/contacts`);
}

export async function createProjectContact(projectRef: string, contactData: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ contact: contactData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to create contact");
  }

  return response.json();
}

export async function updateProjectContact(projectRef: string, contactRef: string, contactData: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/contacts/${contactRef}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ contact: contactData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to update contact");
  }

  return response.json();
}

export async function deleteProjectContact(projectRef: string, contactRef: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/contacts/${contactRef}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to delete contact");
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

export async function fetchClientInvoices(clientRef: string) {
  return fetchFromApi(`/clients/${clientRef}/invoices`);
}

export async function fetchClientBills(clientRef: string) {
  return fetchFromApi(`/clients/${clientRef}/bills`);
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

export async function updateClient(ref: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/clients/${ref}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ client: data })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to update client");
  }

  return response.json();
}

export async function createClientNote(clientRef: string, noteData: any) {
  const response = await fetch(`${API_BASE_URL}/clients/${clientRef}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: noteData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create client note");
  }

  return response.json();
}

export async function updateClientNote(clientRef: string, noteRef: string, noteData: any) {
  const response = await fetch(`${API_BASE_URL}/clients/${clientRef}/notes/${noteRef}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: noteData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update client note");
  }

  return response.json();
}

export async function deleteClientNote(clientRef: string,  noteRef: string) {
  const response = await fetch(`${API_BASE_URL}/clients/${clientRef}/notes/${noteRef}`, {
    method: "DELETE" 
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete client note");
  }
}

export async function fetchClientNotes(clientRef: string) {
  return fetchFromApi(`/clients/${clientRef}/notes`);
}


export async function createClientMeeting(clientRef: string, meetingData: any) {
  const response = await fetch(`${API_BASE_URL}/clients/${clientRef}/meetings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meeting: meetingData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create client meeting");
  }

  return response.json();
}

export async function updateClientMeeting(clientRef: string, meetingRef: string, meetingData: any) {
  const response = await fetch(`${API_BASE_URL}/clients/${clientRef}/meetings/${meetingRef}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meeting: meetingData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update client meeting");
  }

  return response.json();
}

export async function deleteClientMeeting(clientRef: string,  meetingRef: string) {
  const response = await fetch(`${API_BASE_URL}/clients/${clientRef}/meetings/${meetingRef}`, {
    method: "DELETE" 
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete client meeting");
  }
}


// --------------------
// Team-related APIs
// --------------------

export async function fetchTeamCosts(projectRef: string, params?: { from?: string; to?: string }) {
  const q = new URLSearchParams();
  if (params?.from) q.set("from", params.from);
  if (params?.to) q.set("to", params.to);

  const res = await fetch(`${API_BASE_URL}/projects/${projectRef}/team_costs?${q.toString()}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function bulkCreateTeamCosts(projectRef: string, data: {
  work_date: string;
  description?: string;
  entries: Array<{ user_ref: string; hours_worked: number; hourly_rate?: number; description?: string }>;
}) {
  const res = await fetch(`${API_BASE_URL}/projects/${projectRef}/team_costs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ team_costs: data }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function fetchUsers() {
  return fetchFromApi("/users");
}

export async function fetchUsersWithFilters(q: string, department: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (department && department !== "all") params.set("department", department);
  const qs = params.toString();
  return fetchFromApi(`/users${qs ? `?${qs}` : ""}`);
}

export async function fetchUserByRef(userRef: string) {
  return fetchFromApi(`/users/${userRef}`);
}

export async function fetchUserObjectives(userRef: string) {
  return fetchFromApi(`/users/${userRef}/projects`);
}

export async function fetchUserInvoices(userRef: string) {
  return fetchFromApi(`/users/${userRef}/invoices`);
}

export async function fetchUserWagePayments(userRef: string) {
  return fetchFromApi(`/users/${userRef}/bills`);
}

export async function fetchUserMeetings(userRef: string) {
  return fetchFromApi(`/users/${userRef}/meetings`);
}

export async function fetchUserTasks(userRef: string) {
  return fetchFromApi(`/users/${userRef}/tasks`);
}

export async function fetchUserNotes(userRef: string) {
  return fetchFromApi(`/users/${userRef}/notes`);
}

// Project Notes APIs
export async function fetchProjectNotes(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/notes`);
}

export async function createProjectNote(projectRef: string, noteData: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: noteData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create project note");
  }

  return response.json();
}

export async function updateProjectNote(projectRef: string, noteRef: string, noteData: any) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/notes/${noteRef}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note: noteData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update project note");
  }

  return response.json();
}

export async function deleteProjectNote(projectRef: string, noteRef: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/notes/${noteRef}`, {
    method: "DELETE" 
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete project note");
  }
}

export async function createUser(userData: any) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user: userData }) // wrap in `client:` as Rails expects
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to create member");
  }

  return response.json();
}

export async function updateUser(ref: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/users/${ref}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ user: data })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to update member");
  }

  return response.json();
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



export async function createSupplier(supplierData: any) {
  const response = await fetch(`${API_BASE_URL}/suppliers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ supplier: supplierData }) // wrap in `client:` as Rails expects
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to create supplier");
  }

  return response.json();
}

export async function updateSupplier(ref: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/suppliers/${ref}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ supplier: data })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to update supplier");
  }

  return response.json();
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

// --------------------
// Document-related APIs
// --------------------

export async function fetchProjectDocuments(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/documents`);
}

export async function uploadProjectDocument(projectRef: string, file: File) {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/documents`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload document");
  }

  return response.json();
}

export async function deleteDocument(documentRef: string) {
  const response = await fetch(`${API_BASE_URL}/documents/${documentRef}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete document");
  }

  return true;
}

// Backstop-related APIs
export async function fetchProjectBackstops(projectRef: string) {
  return fetchFromApi(`/projects/${projectRef}/backstops`);
}

export async function createBackstop(projectRef: string, backstopData: {
  scope_type: "item_line" | "objective" | "task" | "project_profit" | "projected_cashflow";
  scope_ref: string;
  threshold_type: "amount" | "date" | "percentage";
  threshold_value_cents?: number;
  threshold_date?: string;
  threshold_value?: number;
}) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/backstops`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ backstop: backstopData }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.errors?.join(", ") || "Failed to create backstop");
  }

  return response.json();
}

export async function deleteBackstop(projectRef: string, backstopRef: string) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectRef}/backstops/${backstopRef}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete backstop");
  }

  return true;
}
