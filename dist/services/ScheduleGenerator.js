"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleGenerator = void 0;
const types_1 = require("../types");
class ScheduleGenerator {
    constructor(classes, teachers, subjects, constraints) {
        this.classes = classes;
        this.teachers = teachers;
        this.subjects = subjects;
        this.constraints = constraints;
        this.populationSize = 100;
        this.mutationRate = 0.1;
        this.maxGenerations = 1000;
    }
    generateSchedule() {
        let population = this.initializePopulation();
        let bestSchedule = population[0];
        for (let generation = 0; generation < this.maxGenerations; generation++) {
            population = this.evolvePopulation(population);
            const currentBest = this.getBestSchedule(population);
            if (currentBest.fitness > bestSchedule.fitness) {
                bestSchedule = currentBest;
            }
            if (generation % 100 === 0) {
                console.log(`Generation ${generation}: Best fitness = ${bestSchedule.fitness}`);
            }
        }
        return bestSchedule;
    }
    initializePopulation() {
        return Array.from({ length: this.populationSize }, () => this.createRandomSchedule());
    }
    createRandomSchedule() {
        // 实现随机排课逻辑
        const schedule = { cells: [], class: this.classes[0], weekNumber: 1, fitness: 0 };
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
    getRandomDayOfWeek() {
        return Math.floor(Math.random() * 10) + 1; // 1 to 10
    }
    getRandomTimeSlot() {
        const timeSlots = Object.values(types_1.TimeSlot);
        return timeSlots[Math.floor(Math.random() * timeSlots.length)];
    }
    isSlotAvailable(schedule, cls, dayOfWeek, timeSlot) {
        return !schedule.cells.some(cell => cell.class.id === cls.id &&
            cell.dayOfWeek === dayOfWeek &&
            cell.timeSlot === timeSlot);
    }
    getAvailableTeacher(subject, dayOfWeek, timeSlot) {
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
    getAssignedHoursForTeacher(teacher) {
        return 0;
    }
    evolvePopulation(population) {
        const newPopulation = [];
        newPopulation.push(this.getBestSchedule(population));
        while (newPopulation.length < this.populationSize) {
            const parent1 = this.selectParent(population);
            const parent2 = this.selectParent(population);
            const child = this.crossover(parent1, parent2);
            newPopulation.push(this.mutate(child));
        }
        return newPopulation;
    }
    selectParent(population) {
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
    crossover(parent1, parent2) {
        return parent1;
    }
    mutate(schedule) {
        return schedule;
    }
    getBestSchedule(population) {
        return population.reduce((best, current) => current.fitness > best.fitness ? current : best);
    }
}
exports.ScheduleGenerator = ScheduleGenerator;
