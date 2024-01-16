import SprintCard from '@/components/cards/SprintCard';
import { Button } from '@/components/ui/button';
import prisma from '@/config/db';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import React from 'react';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Sprints',
  description: 'The place where you can view all the sprints of sprint it',
};

const SprintsPage = async ({ params }: { params: Params }) => {
  const sprints = await prisma.sprint.findMany({
    where: {
      projectId: params.projectId,
    },
  });

  return (
    <>
      {sprints.length === 0 ? (
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
            No sprints created yet, start sprint it by adding a new sprint
          </p>
          <Button>
            <Link
              href={`/${params.projectId}/${params.projectName}/sprints/add`}
            >
              New Sprint
            </Link>
          </Button>
        </section>
      ) : (
        <section>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl'>Sprints</h1>
            <Button>
              <Link
                href={`/${params.projectId}/${params.projectName}/sprints/add`}
              >
                New sprint
              </Link>
            </Button>
          </div>
          <section className='mt-5 grid md:grid-cols-3 grid-cols-1 gap-8'>
            {sprints.map((item) => {
              return <SprintCard key={item.id} sprint={item} params={params} />;
            })}
          </section>
        </section>
      )}
    </>
  );
};

export default SprintsPage;
