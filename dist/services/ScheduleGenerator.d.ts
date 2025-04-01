import { Subject, Teacher, Class } from '../types';
import { Schedule } from '../types/schedule';
import { ScheduleConstraints } from '../types/constraints';
export declare class ScheduleGenerator {
    private classes;
    private teachers;
    private subjects;
    private constraints;
    private populationSize;
    private mutationRate;
    private maxGenerations;
    constructor(classes: Class[], teachers: Teacher[], subjects: Subject[], constraints: ScheduleConstraints);
    generateSchedule(): Schedule;
    private initializePopulation;
    private createRandomSchedule;
    private getRandomDayOfWeek;
    private getRandomTimeSlot;
    private isSlotAvailable;
    private getAvailableTeacher;
    private getAssignedHoursForTeacher;
    private evolvePopulation;
    private selectParent;
    private crossover;
    private mutate;
    private getBestSchedule;
}
