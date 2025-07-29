
export const calculateStatusFromDates = (startDate: string, dueDate: string): 'Planned' | 'In Progress' | 'Already Due' => {
  const today = new Date();
  const start = new Date(startDate);
  const due = new Date(dueDate);
  
  // Remove time component for accurate date comparison
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  
  if (today < start) {
    return 'Planned';
  } else if (today >= start && today <= due) {
    return 'In Progress';
  } else {
    return 'Already Due';
  }
};
