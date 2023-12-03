import TaskCard from '@/components/cards/TaskCard';
import { Button } from '@/components/ui/button';
import prisma from '@/config/db';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Sprint it | Backlog',
  description: 'The backlog page of sprint it',
};

const BacklogPage = async ({ params }: { params: Params }) => {
  const backlogTasks = await prisma.task.findMany({
    where: {
      isInBacklog: true,
      AND: {
        projectId: params.projectId,
      },
    },
  });

  const allUsers = await prisma.user.findMany();

  const finalBacklogTasks = backlogTasks.map((task) => {
    const findUser = allUsers.find(
      (user) => user.clerkUserId === task.assignedUserId
    );
    return {
      ...task,
      assignedUserPic: findUser?.photo!,
      assignedUserName: findUser?.username!,
    };
  });

  return (
    <>
      <>
        {backlogTasks.length === 0 ? (
          <section className='flex items-center mt-28 justify-center flex-col'>
            <Image
              src='/empty-state.svg'
              alt='landing'
              width='500'
              height='500'
              placeholder='blur'
              blurDataURL='/empty-state.svg'
            />
            <p className='my-5 text-xl text-center'>
              No tasks added, start sprint it by adding a new task
            </p>
            <Button>
              <Link
                href={`/${params.projectId}/${params.projectName}/backlog/add`}
              >
                New task
              </Link>
            </Button>
          </section>
        ) : (
          <section>
            <div className='flex justify-between items-center'>
              <h1 className='text-2xl'>Backlog</h1>
              <Button>
                <Link
                  href={`/${params.projectId}/${params.projectName}/backlog/add`}
                >
                  New task
                </Link>
              </Button>
            </div>
            <section className='mt-5 grid md:grid-cols-3 grid-cols-1 gap-8'>
              {finalBacklogTasks.map((item) => {
                return (
                  <TaskCard
                    key={item.id}
                    task={item}
                    params={params}
                    navigate='backlog'
                  />
                );
              })}
            </section>
          </section>
        )}
      </>
    </>
  );
};

export default BacklogPage;
