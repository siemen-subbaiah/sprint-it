import TaskView from '@/components/TaskView';
import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

// export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Task Details',
  description: 'The place where you view a task in sprint it',
};

const TaskDetailedPage = async ({ params }: { params: Params }) => {
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

  if (!task) {
    notFound();
  }

  const finalTask = {
    ...task!,
    assignedUserPic: assignedUser[0]?.photo!,
    assignedUserName: assignedUser[0]?.username!,
    projectName: associatedProject?.name!,
    sprintName: task?.sprintId ? associatedSprint?.sprintName : 'Backlog',
  };

  return (
    <TaskView
      finalTask={finalTask}
      params={params}
      userId={user?.id!}
      navigate='task'
    />
  );
};

export default TaskDetailedPage;
