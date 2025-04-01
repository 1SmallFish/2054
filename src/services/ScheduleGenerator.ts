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
    const schedule: Schedule = { cells: [], classId: this.classes[0]["id"], weekNumber: 1, fitness: 0 };

    for (const cls of this.classes) {
      for (const subject of this.subjects) {
        let hoursAssigned = 0;

        while (hoursAssigned < subject.hoursPerWeek) {
          const dayOfWeek = this.getRandomDayOfWeek();
          const timeSlot = this.getRandomTimeSlot();

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

    schedule.fitness = this.calculateFitness(schedule);
    return schedule;
  }

  private getRandomDayOfWeek(): number {
    return Math.floor(Math.random() * 7) + 1; // 1 to 7
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
      if (!teacher.subjects.includes(subject.name)) {
        return false;
      }
      if (teacher.preferences?.days.includes(dayOfWeek) && teacher.preferences?.timeSlots.includes(timeSlot)) {
        return false;
      }

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
    let assignedHours = 0;

    for (const cls of this.classes) {
      for (const subject of this.subjects) {
        if (cls.schedule){
          for (const cell of cls.schedule.cells) {
            if (cell.teacher.id === teacher.id) {
              assignedHours++;
            }
          }
        }
        
      }
    }

    return assignedHours;
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
    const child: Schedule = { cells: [], classId: this.classes[0]["id"], weekNumber: 1, fitness: 0 };

    const midpoint = Math.floor(parent1.cells.length / 2);
    child.cells = parent1.cells.slice(0, midpoint).concat(parent2.cells.slice(midpoint));

    child.fitness = this.calculateFitness(child);
    return child;
  }

  private mutate(schedule: Schedule): Schedule {
    for (let i = 0; i < schedule.cells.length; i++) {
      if (Math.random() < this.mutationRate) {
        const dayOfWeek = this.getRandomDayOfWeek();
        const timeSlot = this.getRandomTimeSlot();

        if (this.isSlotAvailable(schedule, schedule.cells[i].class, dayOfWeek, timeSlot)) {
          schedule.cells[i].dayOfWeek = dayOfWeek;
          schedule.cells[i].timeSlot = timeSlot;
        }
      }
    }

    schedule.fitness = this.calculateFitness(schedule);
    return schedule;
  }

  private calculateFitness(schedule: Schedule): number {
    let fitness = 0;

    // 课程均衡性
    const courseCount: { [key: string]: number } = {};
    for (let cell of schedule.cells) {
      const courseName = cell.subject.name;
      courseCount[courseName] = (courseCount[courseName] || 0) + 1;
    }
    const totalCourses = Object.values(courseCount).reduce((a, b) => a + b, 0);
    const averageCourses = totalCourses / Object.keys(courseCount).length;
    for (let count of Object.values(courseCount)) {
      fitness -= Math.abs(count - averageCourses);
    }

    // 教师冲突
    const teacherSchedule: { [key: string]: Set<number> } = {};
    for (let cell of schedule.cells) {
      const teacherName = cell.teacher.name;
      const timeSlotKey = Number(cell.dayOfWeek * 10 + cell.timeSlot) ;
      // const timeSlotKey = `${cell.dayOfWeek}-${cell.timeSlot}`; // 将 timeSlotKey 转换为字符串
      if (!teacherSchedule[teacherName]) {
        teacherSchedule[teacherName] = new Set();
      }
      console.log(teacherSchedule[teacherName]);
      if (teacherSchedule[teacherName].has(timeSlotKey)) {
        fitness -= 10; // 每次冲突减10分
      } else {
        teacherSchedule[teacherName].add(timeSlotKey);
      }
    }

    // 课程类型限制
    for (let cell of schedule.cells) {
      if (cell.timeSlot === TimeSlot.MORNING_STUDY && (cell.subject.name !== '语文' && cell.subject.name !== '英语')) {
        fitness -= 5; // 早自习课程类型不符合要求
      }
      if ((cell.timeSlot === TimeSlot.EVENING_STUDY_1 || cell.timeSlot === TimeSlot.EVENING_STUDY_2) && !['数学', '物理', '化学', '生物', '历史', '政治', '地理'].includes(cell.subject.name)) {
        fitness -= 5; // 晚自习课程类型不符合要求
      }
    }

    return fitness;
  }

  private getBestSchedule(population: Schedule[]): Schedule {
    return population.reduce((best, current) =>
      current.fitness! > best.fitness! ? current : best
    );
  }
}