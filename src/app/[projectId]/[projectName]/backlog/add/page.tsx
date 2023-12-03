import TaskAddEdit from '@/components/TaskAddEdit';
import prisma from '@/config/db';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sprint it | Add Task',
  description: 'The place where you add a task in sprint it',
};

const BacklogAddPage = async ({ params }: { params: Params }) => {
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
      isBacklog={true}
      users={users}
      sprints={sprints}
      params={params}
    />
  );
};

export default BacklogAddPage;
