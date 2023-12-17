import Widget from '@/components/dashboard/Widget';
import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import React from 'react';
import TaskStatus from '@/components/dashboard/TaskStatus';
import UserStatus from '@/components/dashboard/UserStatus';
import {
  getTaskStatus,
  getTaskType,
  getUserStatus,
  getWidgetList,
} from '@/lib/dashboardUtils';
import TaskType from '@/components/dashboard/TaskType';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sprint it | Dashboard',
  description: 'The beautifully crafted dashboard for sprint it',
};

const DashboardPage = async ({ params }: { params: Params }) => {
  // checking if the user is confirmed or not!

  const clerkUser = await currentUser();
  if (clerkUser) {
    const user = await prisma.user.findMany({
      where: {
        email: clerkUser?.emailAddresses[0]?.emailAddress,
        projects: {
          every: {
            project: {
              uniqueId: params.projectId,
            },
          },
        },
      },
    });

    if (user.length >= 1) {
      if (!user[0].isConfirmed) {
        await prisma.user.update({
          where: {
            id: user[0].id,
          },
          data: {
            isConfirmed: true,
            username: clerkUser?.username!
              ? clerkUser?.username!
              : clerkUser?.firstName!,
            photo: clerkUser?.imageUrl,
            clerkUserId: clerkUser?.id,
          },
        });
      }
    }
  }

  const currentProject = await prisma.project.findUnique({
    where: {
      uniqueId: params.projectId,
    },
  });

  const totalUsers = await prisma.user.findMany({
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

  const totalSprints = await prisma.sprint.findMany({
    where: {
      projectId: params.projectId,
    },
  });

  const tasks = await prisma.task.findMany({
    where: {
      projectId: params.projectId,
    },
  });

  const modedTasks = tasks.map((task) => {
    const findUser = totalUsers.find(
      (user) => user.clerkUserId === task.assignedUserId
    );
    return {
      ...task,
      assignedUserName: findUser?.username!,
    };
  });

  const widgets = getWidgetList(totalSprints, totalUsers);

  const { taskLabels, taskSeries } = getTaskStatus(modedTasks);

  const { typeLabels, typeSeries } = getTaskType(modedTasks);

  const { userLabels, seriesData } = getUserStatus(modedTasks);

  return (
    <div>
      <section className='mb-6'>
        <h1 className='text-3xl'>{currentProject?.name}</h1>
        <div className='flex gap-4 mt-1'>
          <p>Owner : {currentProject?.createdUserName}</p>
          <p>
            Created on :{' '}
            {new Date(currentProject?.createdAt!).toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-10'>
        {widgets.map((item) => {
          return <Widget key={item.id} widget={item} />;
        })}
      </section>

      <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <TaskStatus label={taskLabels} series={taskSeries} />
        <TaskType label={typeLabels} series={typeSeries} />
      </section>

      <UserStatus xAxisLabels={userLabels} series={seriesData} />
    </div>
  );
};

export default DashboardPage;
