import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import React from 'react';

const DashboardPage = async ({ params }: { params: any }) => {
  // checking if the user is confirmed or not!

  const clerkUser = await currentUser();

  const allProjects = clerkUser?.publicMetadata?.projects as Project[];

  const currentProject = allProjects?.find(
    (item) => item.id === params.projectId
  )?.id;

  if (clerkUser) {
    const user = await prisma.user.findMany({
      where: {
        email: clerkUser?.emailAddresses[0]?.emailAddress,
        projects: {
          every: {
            project: {
              uniqueId: currentProject,
            },
          },
        },
      },
    });

    console.log(user);

    if (user) {
      if (!user[0].isConfirmed) {
        await prisma.user.update({
          where: {
            id: user[0].id,
          },
          data: {
            isConfirmed: true,
            username: clerkUser?.username!
              ? clerkUser?.username!
              : clerkUser?.firstName!,
            photo: clerkUser?.imageUrl,
            clerkUserId: clerkUser?.id,
          },
        });
      }
    }
  }

  return <div>Dashboard --- Page of {params.projectName}</div>;
};

export default DashboardPage;
