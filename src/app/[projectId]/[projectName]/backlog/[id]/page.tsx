import TaskView from '@/components/TaskView';
import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import { notFound } from 'next/navigation';
import React from 'react';
import { Metadata } from 'next';

// export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Task Details',
  description: 'The place where you view a task in sprint it',
};

const BacklogDetailedPage = async ({ params }: { params: Params }) => {
  const user = await currentUser();

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

  let associatedProject;
  if (task) {
    associatedProject = await prisma.project.findUnique({
      where: {
        uniqueId: task?.projectId,
      },
    });
  }

  const finalTask = {
    ...task!,
    assignedUserPic: assignedUser[0]?.photo!,
    assignedUserName: assignedUser[0]?.username!,
    projectName: associatedProject?.name!,
    sprintName: task?.sprintId ? associatedSprint?.sprintName : 'Backlog',
  };

  if (!task) {
    notFound();
  }

  return (
    <TaskView
      finalTask={finalTask}
      params={params}
      userId={user?.id!}
      navigate='backlog'
    />
  );
};

export default BacklogDetailedPage;
