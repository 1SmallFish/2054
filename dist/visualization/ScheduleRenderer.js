"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleGenerator = exports.ScheduleRenderer = void 0;
const ExcelJS = __importStar(require("exceljs"));
const fs = __importStar(require("fs/promises"));
class ScheduleRenderer {
    async renderToHtml(schedule, outputPath) {
        const html = this.generateHtml(schedule);
        await fs.writeFile(outputPath, html);
    }
    async renderToExcel(schedule, outputPath) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Schedule');
        this.addTableHeaders(worksheet);
        this.addTableData(worksheet, schedule);
        await workbook.xlsx.writeFile(outputPath);
    }
    generateHtml(schedule) {
        return '';
    }
    addTableHeaders(worksheet) { }
    addTableData(worksheet, schedule) { }
}
exports.ScheduleRenderer = ScheduleRenderer;
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
        return {
            cells: [],
            class: this.classes[0],
            weekNumber: 1,
            fitness: 0
        };
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
        return population[0];
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
