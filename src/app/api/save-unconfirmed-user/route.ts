import prisma from '@/config/db';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { email, currentUserId, currentProject } = await request.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: email?.toString()!,
        isConfirmed: false,
        role: 'Member',
        invitedUserId: currentUserId,
        projects: {
          create: {
            project: {
              connect: {
                id: currentProject,
              },
            },
          },
        },
      },
    });

    if (user) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
};
