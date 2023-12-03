import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

interface IncomingRes {
  sprintName: string;
  sprintDescription: string;
  startDate: Date;
  endDate: Date;
  projectId: string;
}

export const POST = async (request: Request) => {
  const user = await currentUser();

  const res: IncomingRes = await request.json();

  try {
    const sprint = await prisma.sprint.create({
      data: {
        createdUserId: user?.id!,
        createdUserName: user?.username ? user?.username : user?.firstName!,
        sprintName: res?.sprintName,
        sprintDescription: res?.sprintDescription,
        startDate: res.startDate,
        endDate: res.endDate,
        isInProgress: true,
        project: {
          connect: {
            uniqueId: res.projectId,
          },
        },
      },
    });

    if (sprint) {
      return NextResponse.json({
        success: true,
        message: 'Sprint successfully created',
        sprint,
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
