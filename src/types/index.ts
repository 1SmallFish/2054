export enum SubjectType {
  MAIN = 'MAIN',
  MINOR = 'MINOR',
  ACTIVITY = 'ACTIVITY'
}

export enum TimeSlot {
  MORNING_STUDY = 'MORNING_STUDY',
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  FOURTH = 'FOURTH',
  FIFTH = 'FIFTH',
  SIXTH = 'SIXTH',
  SEVENTH = 'SEVENTH',
  EIGHTH = 'EIGHTH',
  EVENING_STUDY_1 = 'EVENING_STUDY_1',
  EVENING_STUDY_2 = 'EVENING_STUDY_2'
}

export interface Teacher {
  id: string;
  name: string;
  subjects: string[];
  preferences?: {
    timeSlots: TimeSlot[];
    days: number[];
  };
  maxHoursPerWeek?: number;
  
}


export interface Class {
  id: string;
  name: string;
  grade: number;
}

export interface Subject {
  id: string;
  name: string;
  type: SubjectType;
  hoursPerWeek: number;
  priority?: number;
}
