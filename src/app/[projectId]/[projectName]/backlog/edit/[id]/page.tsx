import TaskAddEdit from '@/components/TaskAddEdit';
import prisma from '@/config/db';
import React from 'react';

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
