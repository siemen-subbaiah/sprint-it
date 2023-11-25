export const priority = [
  {
    id: '1',
    name: 'None',
  },
  {
    id: '2',
    name: 'Low',
  },
  {
    id: '3',
    name: 'Medium',
  },
  {
    id: '4',
    name: 'High',
  },
];

export const status = [
  {
    id: '1',
    name: 'To do',
  },
  {
    id: '2',
    name: 'In progress',
  },
  {
    id: '3',
    name: 'Blocked',
  },
  {
    id: '4',
    name: 'Done',
  },
];

export const type = [
  {
    id: '1',
    name: 'Task',
  },
  {
    id: '2',
    name: 'Bug',
  },
  {
    id: '3',
    name: 'Story',
  },
];

export const points: { id: string; name: string }[] = [];

for (let i = 1; i <= 20; i++) {
  points.push({
    id: i.toString(),
    name: i.toString(),
  });
}

export enum Priority {
  None = 1,
  Low,
  Medium,
  High,
}

export enum Status {
  'To do' = 1,
  'In progress',
  'Blocked',
  'Done',
}

export enum Type {
  'Task' = 1,
  'Bug',
  'Story',
}

export enum PriorityColor {
  '#5E6C84' = 1,
  '#0E721E',
  '#FFA10A',
  '#B71A35',
}
