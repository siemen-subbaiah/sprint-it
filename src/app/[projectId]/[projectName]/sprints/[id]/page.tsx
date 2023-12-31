import TaskCard from '@/components/cards/TaskCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import prisma from '@/config/db';
import Link from 'next/link';
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Sprint it | Sprint Details',
  description: 'The place where you view the sprint details in sprint it',
};

const SprintDetailPage = async ({ params }: { params: Params }) => {
  const sprintId = Number(params.id);

  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
  });

  const associatedProject = await prisma.project.findFirst({
    where: {
      uniqueId: sprint?.projectId,
    },
  });

  const allUsers = await prisma.user.findMany();

  const sprintTasks = await prisma.task.findMany({
    where: {
      sprintId,
    },
  });

  const finalSprintTasks = sprintTasks.map((task) => {
    const findUser = allUsers.find(
      (user) => user.clerkUserId === task.assignedUserId
    );
    return {
      ...task,
      assignedUserPic: findUser?.photo!,
      assignedUserName: findUser?.username!,
    };
  });

  const totalPoints = finalSprintTasks
    .map((item) => item.estimatedPoints)
    .reduce((acc, curr) => acc + curr, 0);

  const handleEndSprint = async () => {
    'use server';
    await prisma.sprint.update({
      where: {
        id: sprint?.id,
      },
      data: {
        isEnded: true,
        isInProgress: false,
      },
    });
    revalidatePath(`/${params.projectId}/${params.projectName}/sprints`);
    redirect(`/${params.projectId}/${params.projectName}/sprints`);
  };

  if (!sprint) {
    notFound();
  }

  return (
    <>
      <h1 className='text-2xl'>{sprint?.sprintName}</h1>
      <section className='flex gap-3 items-baseline'>
        <h2 className='text-xl mt-4'>Created By : {sprint?.createdUserName}</h2>
        <p className='text-[#A89E9E]'>
          {new Date(sprint?.createdAt!).toLocaleDateString()}
        </p>
      </section>

      <Separator className='my-6' />
      <h1 className='text-2xl text-[#0072F5]'>Basic Details</h1>
      <p className='mt-6'>Project Name : {associatedProject?.name}</p>
      <p className='mt-6'>
        Start Date : {new Date(sprint?.startDate!).toLocaleDateString()}
      </p>
      <p className='mt-6'>
        End Date : {new Date(sprint?.endDate!).toLocaleDateString()}
      </p>
      <p className='mt-6'>Project Name : {associatedProject?.name}</p>
      <p className='mt-4'>Total Estimation Points : {totalPoints}</p>
      <Separator className='my-4' />
      <h1 className='text-2xl text-[#0072F5] mt-3'>Description</h1>
      <p className='mt-4'>{sprint?.sprintDescription}</p>
      <Separator className='my-4' />
      <section className='flex gap-3 items-baseline justify-between'>
        <h1 className='text-2xl text-[#0072F5] mt-3'>Items</h1>
        <Button variant='secondary'>
          <Link
            href={`/${params.projectId}/${params.projectName}/sprints/add-task`}
          >
            Add Item
          </Link>
        </Button>
      </section>
      <section className='my-5 grid md:grid-cols-3 grid-cols-1 gap-8'>
        {finalSprintTasks.map((item) => {
          return (
            <TaskCard
              key={item.id}
              task={item}
              params={params}
              navigate='task'
            />
          );
        })}
      </section>
      <Separator className='my-4' />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className='mb-5'>End Sprint</Button>
        </AlertDialogTrigger>
        <AlertDialogPortal>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to end sprint?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently end the
                sprint.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form action={handleEndSprint}>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type='submit'>End</Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </>
  );
};

export default SprintDetailPage;
