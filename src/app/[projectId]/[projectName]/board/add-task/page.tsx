import TaskAddEdit from '@/components/TaskAddEdit';
import prisma from '@/config/db';
import React from 'react';

const TaskAddFromBoardPage = async ({ params }: { params: Params }) => {
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
      redirectToSprintPage={false}
    />
  );
};

export default TaskAddFromBoardPage;
