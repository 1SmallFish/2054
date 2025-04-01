import { Teacher, TimeSlot, Subject, Class } from '.';

export interface ScheduleCell {
  dayOfWeek: number;
  timeSlot: TimeSlot;
  subject: Subject;
  teacher: Teacher;
  class: Class;
}

export interface Schedule {
  cells: ScheduleCell[];
  class: Class;
  weekNumber: number;
  fitness?: number;
}
