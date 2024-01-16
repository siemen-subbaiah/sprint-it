import TaskAddEdit from '@/components/TaskAddEdit';
import prisma from '@/config/db';
import { notFound } from 'next/navigation';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Task',
  description: 'The place where you edit a task in sprint it',
};

const BacklogEditPage = async ({ params }: { params: Params }) => {
  const taskId = Number(params.id);

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

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      attachments: true,
    },
  });

  if (!task) {
    notFound();
  }

  return (
    <TaskAddEdit
      isBacklog={true}
      users={users}
      sprints={sprints}
      params={params}
      task={task!}
    />
  );
};

export default BacklogEditPage;
