import SetupModal from '@/components/SetupModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sprint it | Settings',
  description: 'The place where you can view the settings of sprint it',
};

const SettingsPage = async ({ params }: { params: any }) => {
  const clerkUser = await currentUser();

  const allProjects = clerkUser?.publicMetadata?.projects as Project[];

  const currentProject = allProjects?.filter(
    (item) => item.id === params.projectId
  );

  const isAdmin = clerkUser?.publicMetadata?.isAdmin as Boolean;

  const user = await prisma.user.findMany({
    where: {
      email: clerkUser?.emailAddresses[0]?.emailAddress,
      projects: {
        every: {
          project: {
            uniqueId: currentProject[0]?.id,
          },
        },
      },
    },
  });

  const users = await prisma.user.findMany({
    where: {
      isConfirmed: true,
    },
  });

  const allUsers = users.filter(
    (item) => item.email !== clerkUser?.emailAddresses[0]?.emailAddress
  );

  const handleUserEdit = async (formData: FormData) => {
    'use server';

    const username = formData.get('username')?.toString()!;
    const bio = formData.get('bio')?.toString()!;

    await prisma.user.update({
      where: {
        id: user[0].id,
      },
      data: {
        username,
        bio,
      },
    });
    revalidatePath(`/${params.projectId}/${params.projectName}/settings`);
  };

  return (
    <>
      <h1 className='text-2xl mb-5'>Account Settings</h1>
      <section className='md:grid grid-cols-2'>
        <section>
          <Avatar className='md:w-80 md:h-80 w-24 h-24'>
            <AvatarImage src={user[0]?.photo!} alt='@shadcn' />
            <AvatarFallback>{`${clerkUser?.firstName}${clerkUser?.lastName}`}</AvatarFallback>
          </Avatar>
        </section>
        <form className='mt-4 md:mt-0' action={handleUserEdit}>
          <div>
            <Label htmlFor='username'>SI username</Label>
            <Input
              type='text'
              id='username'
              name='username'
              value={user[0]?.username!}
            />
          </div>
          <div className='mt-8'>
            <Label htmlFor='bio'>Bio</Label>
            <Textarea
              id='bio'
              className='h-32'
              name='bio'
              value={user[0]?.bio!}
            />
          </div>
          <Button className='mt-5' type='submit'>
            Save
          </Button>
        </form>
      </section>

      {isAdmin && (
        <section>
          <Separator className='my-4' />
          <div className='mb-5'>
            <h1 className='text-2xl'>Create new project</h1>
            <SetupModal showOtherUsers={true} allUsers={allUsers} />
          </div>
        </section>
      )}
    </>
  );
};

export default SettingsPage;
