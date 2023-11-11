import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import prisma from '@/config/db';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BacklogPage = async ({ params }: { params: Params }) => {
  const backlogTasks = await prisma.task.findMany({
    where: {
      isInBacklog: true,
      AND: {
        projectId: params.projectId,
      },
    },
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
              {backlogTasks.map((item) => {
                return <TaskCard key={item.id} task={item} params={params} />;
              })}
            </section>
          </section>
        )}
      </>
    </>
  );
};

export default BacklogPage;
