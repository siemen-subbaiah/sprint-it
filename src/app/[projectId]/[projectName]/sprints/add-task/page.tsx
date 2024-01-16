import TaskAddEdit from '@/components/TaskAddEdit';
import prisma from '@/config/db';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Add Task',
  description: 'The place where you add a task in sprint it',
};

const TaskAddFromSprintPage = async ({ params }: { params: Params }) => {
  const users = await prisma.user.findMany({
    where: {
      projects: {
        every: {
          project: {
            uniqueId: params.projectId,
          },
        },
      },
    },
  });

  const sprints = await prisma.sprint.findMany({
    where: {
      isInProgress: true,
      AND: {
        projectId: params.projectId,
      },
    },
  });
  return (
    <TaskAddEdit
      isBacklog={false}
      users={users}
      sprints={sprints}
      params={params}
      redirectToSprintPage={true}
    />
  );
};

export default TaskAddFromSprintPage;
