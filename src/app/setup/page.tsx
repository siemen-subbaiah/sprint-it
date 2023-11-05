import React from 'react';
import type { Metadata } from 'next';
import SetupModal from '@/components/SetupModal';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sprint it | Setup',
};

const SetupPage = async () => {
  const user = auth();

  const metaData = user.sessionClaims?.meta_data as any;

  if (metaData.hasOwnProperty('isAdmin')) {
    const firstProject = user.sessionClaims?.meta_data as any;

    redirect(
      `/${firstProject.projects[0].id}/${firstProject.projects[0].name}/dashboard`
    );
  }

  return (
    <section className='flex flex-col mt-36 items-center justify-center'>
      <h1 className='md:text-5xl text-2xl text-center md:w-2/3 md:leading-normal'>
        Create you first project and invite your first team member!
      </h1>

      <SetupModal showOtherUsers={false} allUsers={[]} />
    </section>
  );
};

export default SetupPage;
