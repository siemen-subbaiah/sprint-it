'use server';

import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

export const commentToServer = async (
  params: Params,
  comment: string,
  taskId: number,
  isEdit: boolean,
  commentId: number
) => {
  const user = await currentUser();

  const createdUserId = user?.id!;
  const createdUserName = user?.username ? user?.username! : user?.firstName!;
  const createdUserPic = user?.imageUrl!;

  if (!isEdit) {
    await prisma.comment.create({
      data: {
        createdUserId,
        createdUserName,
        createdUserPic,
        comment,
        task: {
          connect: {
            id: taskId,
          },
        },
      },
    });
  } else {
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        comment,
      },
    });
  }

  revalidatePath(
    `/${params.projectId}/${params.projectName}/backlog/${params.id}`
  );
};

export const deleteComment = async (commentId: number, params: Params) => {
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
  revalidatePath(
    `/${params.projectId}/${params.projectName}/backlog/${params.id}`
  );
};
