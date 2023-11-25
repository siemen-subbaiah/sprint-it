import UserCard from '@/components/cards/UserCard';
import { Button } from '@/components/ui/button';
import prisma from '@/config/db';
import React from 'react';

const UsersPage = async ({ params }: { params: Params }) => {
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

  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl'>Users</h1>
        <Button>Invite User</Button>
      </div>
      <section className='mt-5 grid md:grid-cols-3 grid-cols-1 gap-8'>
        {users.map((item) => {
          return <UserCard key={item.id} user={item} />;
        })}
      </section>
    </>
  );
};

export default UsersPage;
