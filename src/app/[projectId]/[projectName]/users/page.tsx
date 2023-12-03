import InviteUserModal from '@/components/InviteUserModal';
import UserCard from '@/components/cards/UserCard';
import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sprint it | Users',
  description: 'The place where you view all the users of sprint it',
};

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

  const currentProject = await prisma.project.findMany({
    where: {
      uniqueId: params.projectId,
    },
  });

  const clerkUser = await currentUser();

  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl'>Users</h1>
        <InviteUserModal
          currentProject={currentProject[0]}
          currentUserId={clerkUser?.id!}
        />
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
