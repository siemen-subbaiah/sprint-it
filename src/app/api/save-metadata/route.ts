import { clerkClient } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { userId, projects, isAdmin } = await request.json();

  try {
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        isAdmin,
        projects,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
};
