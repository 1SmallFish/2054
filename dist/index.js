"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScheduleGenerator_1 = require("./services/ScheduleGenerator");
const ScheduleRenderer_1 = require("./visualization/ScheduleRenderer");
async function main() {
    // 初始化数据
    const classes = [];
    const teachers = [];
    const subjects = [];
    const constraints = {
        maxHoursPerDay: 11,
        maxHoursPerWeek: 115.5,
        maxConsecutiveHours: 4,
        morningStudySubjects: ['语文', '英语'],
        eveningStudySubjects: ['数学', '物理', '化学', '生物', '历史', '政治', '地理'],
        subjectTimeConstraints: []
    };
    // 生成课程表
    const generator = new ScheduleGenerator_1.ScheduleGenerator(classes, teachers, subjects, constraints);
    const schedule = generator.generateSchedule();
    // 渲染课程表
    const renderer = new ScheduleRenderer_1.ScheduleRenderer();
    await renderer.renderToHtml(schedule, 'schedule.html');
    // await renderer.renderToExcel(schedule, 'schedule.xlsx');
}
main().catch(console.error);
