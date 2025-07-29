
export interface CalendarEvent {
  id: string;
  title: string;
  color: string;
  isAllDay: boolean;
  startDate: Date;
  endDate: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  notificationEmail?: string;
  notificationTiming: 'none' | '1day' | '1week' | 'custom';
  customNotificationDays?: number;
  note?: string;
  attachedDoc?: File;
  participants: string[];
}

export type EventColor = 
  | 'blue' 
  | 'green' 
  | 'red' 
  | 'yellow' 
  | 'purple' 
  | 'pink' 
  | 'orange' 
  | 'gray';
