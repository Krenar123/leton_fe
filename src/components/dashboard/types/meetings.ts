
export interface Meeting {
  id: string;
  companyName: string; // new mandatory field
  name: string; // with who (now optional in display)
  ourPersons: string[];
  description: string;
  project: string;
  projectId: number;
  location: string;
  date: string;
  time: string;
  status: "upcoming" | "completed";
  type: "client-meeting" | "internal-meeting";
}

export interface MeetingsTableSettings {
  showName: boolean; // person who we have meeting with
  showOurPersons: boolean;
  showDescription: boolean;
  showProject: boolean;
  showLocation: boolean;
}
