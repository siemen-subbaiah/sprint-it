import TaskView from '@/components/TaskView';
import prisma from '@/config/db';
import React from 'react';

// export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BacklogDetailedPage = async ({ params }: { params: Params }) => {
  const taskId = Number(params.id);

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      comments: true,
      attachments: true,
    },
  });

  const assignedUser = await prisma.user.findMany({
    where: {
      clerkUserId: task?.assignedUserId,
    },
  });

  let associatedSprint;
  if (task?.sprintId) {
    associatedSprint = await prisma.sprint.findUnique({
      where: {
        id: task?.sprintId,
      },
    });
  }

  const associatedProject = await prisma.project.findUnique({
    where: {
      uniqueId: task?.projectId,
    },
  });

  const finalTask = {
    ...task!,
    assignedUserPic: assignedUser[0]?.photo!,
    assignedUserName: assignedUser[0]?.username!,
    projectName: associatedProject?.name!,
    sprintName: task?.sprintId ? associatedSprint?.sprintName : 'Backlog',
  };

  return <TaskView finalTask={finalTask} params={params} />;
};

export default BacklogDetailedPage;
