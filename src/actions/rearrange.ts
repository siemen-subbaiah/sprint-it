'use server';

import prisma from '@/config/db';
import { revalidatePath } from 'next/cache';

export const reArrangeTasks = async (
  res: Task,
  status: number,
  params: Params
) => {
  await prisma.task.update({
    where: {
      id: res.id,
    },
    data: {
      status,
    },
  });

  revalidatePath(`/${params.projectId}/${params.projectName}/board`);
};
