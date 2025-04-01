import { Subject, Teacher, Class, TimeSlot } from '../types';
import { Schedule, ScheduleCell } from '../types/schedule';
import { ScheduleConstraints } from '../types/constraints';

export class ScheduleGenerator {
  private populationSize: number = 100;
  private mutationRate: number = 0.1;
  private maxGenerations: number = 1000;

  constructor(
    private classes: Class[],
    private teachers: Teacher[],
    private subjects: Subject[],
    private constraints: ScheduleConstraints
  ) {}

  generateSchedule(): Schedule {
    let population = this.initializePopulation();
    let bestSchedule = population[0];

    for (let generation = 0; generation < this.maxGenerations; generation++) {
      population = this.evolvePopulation(population);
      const currentBest = this.getBestSchedule(population);

      if (currentBest.fitness! > bestSchedule.fitness!) {
        bestSchedule = currentBest;
      }

      if (generation % 100 === 0) {
        console.log(`Generation ${generation}: Best fitness = ${bestSchedule.fitness}`);
      }
    }

    return bestSchedule;
  }

  private initializePopulation(): Schedule[] {
    return Array.from({ length: this.populationSize }, () => this.createRandomSchedule());
  }

  private createRandomSchedule(): Schedule {
    // 实现随机排课逻辑
    const schedule: Schedule = { cells: [], class: this.classes[0], weekNumber: 1, fitness: 0 };

    for (const cls of this.classes) {
      for (const subject of this.subjects) {
        let hoursAssigned = 0;

        while (hoursAssigned < subject.hoursPerWeek) {
          const dayOfWeek = this.getRandomDayOfWeek();
          const timeSlot = this.getRandomTimeSlot();

          // 检查时间段是否可用
          if (this.isSlotAvailable(schedule, cls, dayOfWeek, timeSlot)) {
            const teacher = this.getAvailableTeacher(subject, dayOfWeek, timeSlot);

            if (teacher) {
              schedule.cells.push({
                dayOfWeek,
                timeSlot,
                subject,
                teacher,
                class: cls
              });
              hoursAssigned++;
            }
          }
        }
      }
    }

    return schedule;
  }

  private getRandomDayOfWeek(): number {
    return Math.floor(Math.random() * 10) + 1; // 1 to 10
  }

  private getRandomTimeSlot(): TimeSlot {
    const timeSlots = Object.values(TimeSlot);
    return timeSlots[Math.floor(Math.random() * timeSlots.length)];
  }

  private isSlotAvailable(schedule: Schedule, cls: Class, dayOfWeek: number, timeSlot: TimeSlot): boolean {
    return !schedule.cells.some(cell =>
      cell.class.id === cls.id &&
      cell.dayOfWeek === dayOfWeek &&
      cell.timeSlot === timeSlot
    );
  }

  private getAvailableTeacher(subject: Subject, dayOfWeek: number, timeSlot: TimeSlot): Teacher | null {
    const availableTeachers = this.teachers.filter(teacher => {
      // 不包含对应学科 false
      if (!teacher.subjects.includes(subject.name)) {
        return false;
      }
      // 没有对应的时间 false
      if (teacher.preferences?.days.includes(dayOfWeek) && teacher.preferences?.timeSlots.includes(timeSlot)) {
        
        return false;
        
      }


      // if (teacher.preferences) {
      //   const isAvailable = teacher.preferences.some(avail =>
      //   avail.days === dayOfWeek && avail.timeSlots.includes(timeSlot)
      //   );
      //   if (!isAvailable) {
      //     return false;
      //   }
      // }

      const assignedHours = this.getAssignedHoursForTeacher(teacher);
      if (teacher.maxHoursPerWeek && assignedHours >= teacher.maxHoursPerWeek) {
        return false;
      }

      return true;
    });

    if (availableTeachers.length > 0) {
      return availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
    }

    return null;
  }

  private getAssignedHoursForTeacher(teacher: Teacher): number {
    return 0;
  }

  private evolvePopulation(population: Schedule[]): Schedule[] {
    const newPopulation: Schedule[] = [];

    newPopulation.push(this.getBestSchedule(population));

    while (newPopulation.length < this.populationSize) {
      const parent1 = this.selectParent(population);
      const parent2 = this.selectParent(population);
      const child = this.crossover(parent1, parent2);
      newPopulation.push(this.mutate(child));
    }

    return newPopulation;
  }

  private selectParent(population: Schedule[]): Schedule {
    const totalFitness = population.reduce((sum, schedule) => sum + (schedule.fitness || 0), 0);
    const random = Math.random() * totalFitness;

    let runningSum = 0;
    for (const schedule of population) {
      runningSum += schedule.fitness || 0;
      if (runningSum >= random) {
    return schedule;
  }
    }

    return population[population.length - 1];
  }

  private crossover(parent1: Schedule, parent2: Schedule): Schedule {
    return parent1;
}

  private mutate(schedule: Schedule): Schedule {
    return schedule;
  }

  private getBestSchedule(population: Schedule[]): Schedule {
    return population.reduce((best, current) =>
      current.fitness! > best.fitness! ? current : best
    );
  }
}