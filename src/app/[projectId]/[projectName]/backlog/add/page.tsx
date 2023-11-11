import TaskAddEdit from '@/components/TaskAddEdit';
import prisma from '@/config/db';
import React from 'react';

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
      projectId: params.projectId,
      isInProgress: true,
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
