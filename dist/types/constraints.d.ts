import { TimeSlot } from '.';
export interface ScheduleConstraints {
    maxHoursPerDay: number;
    maxHoursPerWeek: number;
    maxConsecutiveHours: number;
    morningStudySubjects: string[];
    eveningStudySubjects: string[];
    subjectTimeConstraints: {
        subjectId: string;
        allowedTimeSlots: TimeSlot[];
    }[];
}
