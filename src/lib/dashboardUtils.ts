import { Status, Type } from '@/constants/dropdowns';
import { User } from '@prisma/client';
import {
  AngleIcon,
  StopwatchIcon,
  CheckCircledIcon,
  PersonIcon,
} from '@radix-ui/react-icons';

export const getProjectDetails = (project: Project) => {};

export const getTaskStatus = (tasks: Task[]) => {
  const statusCount: any = {};

  tasks.forEach((item) => {
    const statusName = Status[item.status];

    if (statusCount[statusName]) {
      statusCount[statusName]++;
    } else {
      statusCount[statusName] = 1;
    }
  });

  const taskLabels = Object.keys(statusCount);
  const taskSeries: number[] = Object.values(statusCount);

  return { taskLabels, taskSeries };
};

export const getTaskType = (tasks: Task[]) => {
  const typeCount: any = {};

  tasks.forEach((item) => {
    const typeName = Type[item.itemType];

    if (typeCount[typeName]) {
      typeCount[typeName]++;
    } else {
      typeCount[typeName] = 1;
    }
  });

  const typeLabels = Object.keys(typeCount);
  const typeSeries: number[] = Object.values(typeCount);

  return { typeLabels, typeSeries };
};

export const getUserStatus = (tasks: Task[]) => {
  const userStatusCount: any = {};

  tasks.forEach((item) => {
    const { assignedUserName, status } = item;
    const statusName = Status[status];

    if (!userStatusCount[assignedUserName!]) {
      userStatusCount[assignedUserName!] = {};
    }

    if (userStatusCount[assignedUserName!][statusName]) {
      userStatusCount[assignedUserName!][statusName]++;
    } else {
      userStatusCount[assignedUserName!][statusName] = 1;
    }
  });

  const userLabels: string[] = Object.keys(userStatusCount);
  const seriesData = Object.keys(userStatusCount[userLabels[0]]).map(
    (statusName) => ({
      name: statusName,
      data: userLabels.map(
        (userId) => userStatusCount[userId][statusName] || 0
      ),
    })
  );

  return { userLabels, seriesData };
};

export const getWidgetList = (totalSprints: Sprint[], totalUsers: User[]) => {
  const activeSprints = totalSprints.filter((item) => item.isInProgress);

  const completedSprints = totalSprints.filter((item) => item.isEnded);

  const widgets = [
    {
      id: 1,
      name: 'Total Sprints',
      count: totalSprints.length,
      icon: AngleIcon,
    },
    {
      id: 2,
      name: 'Active Sprints',
      count: activeSprints.length,
      icon: StopwatchIcon,
    },
    {
      id: 3,
      name: 'Completed Sprints',
      count: completedSprints.length,
      icon: CheckCircledIcon,
    },
    {
      id: 4,
      name: 'Total Users',
      count: totalUsers.length,
      icon: PersonIcon,
    },
  ];

  return widgets;
};
