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
    name: 'Code review',
  },
  {
    id: '5',
    name: 'Testing',
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
