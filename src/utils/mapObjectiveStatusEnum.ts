// utils/mapObjectiveStatusEnum.ts

export const mapObjectiveStatusEnum = (statusCode: number): 'not_started' | 'in_progress' | 'completed' | 'on_hold' => {
  switch (statusCode) {
    case 0:
      return 'not_started';
    case 1:
      return 'in_progress';
    case 2:
      return 'completed';
    case 3:
      return 'on_hold';
    default:
      return 'not_started'; // Fallback
  }
};
