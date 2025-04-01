import { ScheduleGenerator } from './services/ScheduleGenerator';
import { ScheduleRenderer } from './visualization/ScheduleRenderer';
import { Class, Teacher, Subject, SubjectType } from './types';
import { ScheduleConstraints } from './types/constraints';

async function main() {
  // 初始化数据
  // const classes: Class[] = [];
  // const teachers: Teacher[] = [];
  // const subjects: Subject[] = [];
  // const constraints: ScheduleConstraints = {
  //   maxHoursPerDay: 11,
  //   maxHoursPerWeek: 115.5,
  //   maxConsecutiveHours: 4,
  //   morningStudySubjects: ['语文', '英语'],
  //   eveningStudySubjects: ['数学', '物理', '化学', '生物', '历史', '政治', '地理'],
  //   subjectTimeConstraints: []
  // };
  const classes: Class[] = [
    { id: '1', name: '1班', grade: 1, schedule: null},
    { id: '2', name: '2班', grade: 1, schedule: null},
    { id: '3', name: '3班', grade: 1, schedule: null},
    { id: '4', name: '4班', grade: 1, schedule: null},
    { id: '5', name: '5班', grade: 1, schedule: null},
    { id: '6', name: '6班', grade: 1, schedule: null},
    { id: '7', name: '7班', grade: 1, schedule: null},
    { id: '8', name: '8班', grade: 1, schedule: null},
    { id: '9', name: '9班', grade: 1, schedule: null},

  ];
  const teachers: Teacher[] = [
    {
      id: "1", name: "Zhanggsan",
      subjects: ["物理"]
    },
    {
      id: "2", name: "lisi",
      subjects: ["化学"]
    },
    {
      id: "3", name: "王五",
      subjects: ["生物"]
    },
    {
      id: "4", name: "李逵",
      subjects: ["体育"]
    },
    {
      id: "5", name: "宋江",
      subjects: ["地理"]
    },
    {
      id: "6", name: "吴用",
      subjects: ["数学"]
    },
    {
      id: "7", name: "谢灵运",
      subjects: ["语文"]
    },
    {
      id: "8", name: "马可波罗",
      subjects: ["英语"]
    },
    {
      id: "9", name: "司马迁",
      subjects: ["历史"]
    },

  ];

  const subjects: Subject[] = [
    {
      id: '1',
      name: '历史',
      type: SubjectType.MAIN,
      hoursPerWeek: 11
    },
    {
      id: '2',
      name: '英语',
      type: SubjectType.MAIN,
      hoursPerWeek: 15
    },
    {
      id: '3',
      name: '数学',
      type: SubjectType.MAIN,
      hoursPerWeek: 15
    },
    {
      id: '4',
      name: '生物',
      type: SubjectType.MAIN,
      hoursPerWeek: 11
    },
    {
      id: '5',
      name: '地理',
      type: SubjectType.MAIN,
      hoursPerWeek: 10
    },
    {
      id: '6',
      name: '化学',
      type: SubjectType.MAIN,
      hoursPerWeek: 10
    },
    {
      id: '7',
      name: '物理',
      type: SubjectType.MAIN,
      hoursPerWeek: 12
    },
  ];
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
