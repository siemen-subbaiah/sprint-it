import TaskCard from '@/components/cards/TaskCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import prisma from '@/config/db';
import Link from 'next/link';
import React from 'react';

export const revalidate = 0;

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
      <p className='mt-4'>Total Estimation Points : {totalPoints}</p>
      <h1 className='text-2xl text-[#0072F5] mt-6'>Description</h1>
      <p className='mt-4'>{sprint?.sprintDescription}</p>
      <section className='flex gap-3 items-baseline justify-between'>
        <h1 className='text-2xl text-[#0072F5] mt-6'>Items</h1>
        <Button>
          <Link
            href={`/${params.projectId}/${params.projectName}/sprints/add-task`}
          >
            Add Item
          </Link>
        </Button>
      </section>
      <section className='mt-5 grid md:grid-cols-3 grid-cols-1 gap-8'>
        {finalSprintTasks.map((item) => {
          return <TaskCard key={item.id} task={item} params={params} />;
        })}
      </section>
    </>
  );
};

export default SprintDetailPage;
