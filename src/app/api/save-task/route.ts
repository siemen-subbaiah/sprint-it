import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

interface IncomingRes {
  itemName: string;
  itemDescription: string;
  assignedUserId: string;
  sprintId: string;
  status: string;
  itemType: string;
  priority: string;
  estimatedPoints: string;
  projectId: string;
}

export const POST = async (request: Request) => {
  const user = await currentUser();

  const res: IncomingRes = await request.json();

  try {
    let task;

    if (Number(res.sprintId) === -1) {
      task = await prisma.task.create({
        data: {
          createdUserId: user?.id!,
          createdUserName: user?.username ? user?.username : user?.firstName!,
          itemName: res.itemName,
          itemDescription: res.itemDescription,
          assignedUserId: res.assignedUserId,
          projectId: res.projectId,
          isInBacklog: true,
          status: Number(res.status),
          itemType: Number(res.itemType),
          priority: Number(res.priority),
          estimatedPoints: Number(res.estimatedPoints),
        },
      });
    } else {
      task = await prisma.task.create({
        data: {
          createdUserId: user?.id!,
          createdUserName: user?.username ? user?.username : user?.firstName!,
          itemName: res.itemName,
          itemDescription: res.itemDescription,
          assignedUserId: res.assignedUserId,
          sprint: {
            connect: {
              id: Number(res.sprintId),
            },
          },
          projectId: res.projectId,
          isInBacklog: false,
          status: Number(res.status),
          itemType: Number(res.itemType),
          priority: Number(res.priority),
          estimatedPoints: Number(res.estimatedPoints),
        },
      });
    }

    if (task) {
      return NextResponse.json({
        success: true,
        message: 'Task successfully created',
        task,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Something went wrong',
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};
