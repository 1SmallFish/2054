import { Schedule } from '../types/schedule';
import { Subject, Teacher, Class } from '../types';
import { ScheduleConstraints } from '../types/constraints';
export declare class ScheduleRenderer {
    renderToHtml(schedule: Schedule, outputPath: string): Promise<void>;
    renderToExcel(schedule: Schedule, outputPath: string): Promise<void>;
    private generateHtml;
    private addTableHeaders;
    private addTableData;
}
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
    private evolvePopulation;
    private selectParent;
    private crossover;
    private mutate;
    private getBestSchedule;
}
