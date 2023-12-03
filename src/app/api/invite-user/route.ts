import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { email, projects } = await request.json();

  try {
    if (!email) {
      return NextResponse.json(
        { message: 'No email ID found' },
        {
          status: 400,
        }
      );
    }

    const body = {
      email_address: email,
      redirect_url: process.env.NEXT_PUBLIC_SIGN_UP_URL,
      public_metadata: {
        isAdmin: false,
        projects,
      },
      ignore_existing: true,
    };

    const res = await fetch('https://api.clerk.com/v1/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.errors) {
      return NextResponse.json({ success: false, data });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
};
