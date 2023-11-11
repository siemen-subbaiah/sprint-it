import { Separator } from '@/components/ui/separator';
import prisma from '@/config/db';
import React from 'react';

type Params = {
  projectId: string;
  projectName: string;
  id: string;
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

  return (
    <>
      <h1 className='text-2xl'>{sprint?.sprintName}</h1>
      <h2 className='text-xl mt-4'>Created By : {sprint?.createdUserName}</h2>
      <Separator className='my-6' />
      <h1 className='text-2xl text-[#0072F5]'>Basic Details</h1>
      <p className='mt-4'>Project Name : {associatedProject?.name}</p>
      <p className='mt-4'>Total Estimation Points : </p>
      <h1 className='text-2xl text-[#0072F5] mt-4'>Description</h1>
      <p className='mt-4'>{sprint?.sprintDescription}</p>
      <h1 className='text-2xl text-[#0072F5] mt-4'>Items</h1>
    </>
  );
};

export default SprintDetailPage;
