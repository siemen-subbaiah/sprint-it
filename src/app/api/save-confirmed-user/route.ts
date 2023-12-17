import prisma from '@/config/db';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { selectedUser, currentUserId, currentProject } = await request.json();

  try {
    const user = await prisma.user.create({
      data: {
        email: selectedUser?.email_addresses[0]?.email_address,
        isConfirmed: true,
        role: 'Member',
        invitedUserId: currentUserId,
        username: selectedUser?.username
          ? selectedUser?.username
          : selectedUser?.first_name,
        photo: selectedUser?.image_url,
        clerkUserId: selectedUser?.id,
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
