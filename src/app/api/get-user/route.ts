import { User } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  try {
    const res = await fetch(
      `https://api.clerk.com/v1/users?email_address=${email}`,
      {
        headers: {
          authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }
    );

    const data = await res.json();

    if (data.length === 0) {
      return NextResponse.json({ success: true, firstTimeUser: true });
    }

    if (data.errors) {
      return NextResponse.json({ success: false, data });
    }

    return NextResponse.json({
      success: true,
      user: data[0],
      firstTimeUser: false,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
};
