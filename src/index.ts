import { ScheduleGenerator } from './services/ScheduleGenerator';
import { ScheduleRenderer } from './visualization/ScheduleRenderer';
import { Class, Teacher, Subject } from './types';
import { ScheduleConstraints } from './types/constraints';

async function main() {
  // 初始化数据
  const classes: Class[] = [];
  const teachers: Teacher[] = [];
  const subjects: Subject[] = [];
  const constraints: ScheduleConstraints = {
    maxHoursPerDay: 11,
    maxHoursPerWeek: 115.5,
    maxConsecutiveHours: 4,
    morningStudySubjects: ['语文', '英语'],
    eveningStudySubjects: ['数学', '物理', '化学', '生物', '历史', '政治', '地理'],
    subjectTimeConstraints: []
  };

  // 生成课程表
  const generator = new ScheduleGenerator(classes, teachers, subjects, constraints);
  const schedule = generator.generateSchedule();

  // 渲染课程表
  const renderer = new ScheduleRenderer();
  await renderer.renderToHtml(schedule, 'schedule.html');
  // await renderer.renderToExcel(schedule, 'schedule.xlsx');
}

main().catch(console.error);
