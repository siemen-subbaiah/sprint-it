'use server';

import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';

type PrevState = {
  success?: boolean;
  message?: string;
  createdProjectName?: string;
  createdProjectId?: string;
  selectedUser?: PrismaUser | null;
};

export const setupAction = async (prevState: any, formData: FormData) => {
  console.log(prevState);

  const clerkUser = await currentUser();

  const projectName = formData.get('projectName');
  const projectPrefix = formData.get('projectPrefix');
  const email = formData.get('email');

  const savedProject = await prisma.project.create({
    data: {
      createdUserId: clerkUser?.id!,
      createdUserName: clerkUser?.username!
        ? clerkUser?.username!
        : clerkUser?.firstName!,
      name: projectName?.toString()!,
      prefix: projectPrefix?.toString()!,
      users: {
        create: {
          user: {
            create: {
              email: clerkUser?.emailAddresses[0].emailAddress!,
              isConfirmed: true,
              role: 'Admin',
              username: clerkUser?.username!
                ? clerkUser?.username!
                : clerkUser?.firstName!,
              photo: clerkUser?.imageUrl,
              clerkUserId: clerkUser?.id,
            },
          },
        },
      },
    },
  });

  // first saving the admin user to the user table!

  const project = [
    {
      id: savedProject.uniqueId,
      name: savedProject.name,
      prefix: savedProject.prefix,
      createdUserId: savedProject.createdUserId,
      createdUserName: savedProject.createdUserName,
    },
  ];

  let adminProjects = clerkUser?.publicMetadata?.projects as Project[];

  if (adminProjects) {
    adminProjects = [...adminProjects, ...project];
  } else {
    adminProjects = project;
  }

  const adminMetaRes = await fetch(
    `${process.env.HOSTED_URL}/api/save-metadata`,
    {
      method: 'POST',
      body: JSON.stringify({
        isAdmin: true,
        userId: clerkUser?.id,
        projects: adminProjects,
      }),
    }
  );

  const adminMetaData = await adminMetaRes.json();

  console.log(adminMetaData);

  const inviteUserInfoRes = await fetch(
    `${process.env.HOSTED_URL}/api/get-user?email=${
      email ? email : prevState.selectedUser?.email
    }`
  );

  const inviteUserInfoData = await inviteUserInfoRes.json();

  console.log(inviteUserInfoData);

  let userProjects: Project[];

  if (inviteUserInfoData?.firstTimeUser) {
    userProjects = project;
    const inviteUserRes = await fetch(
      `${process.env.HOSTED_URL}/api/invite-user`,
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          projects: userProjects,
        }),
      }
    );

    const inviteUserData = await inviteUserRes.json();

    console.log(inviteUserData);

    if (inviteUserData.success) {
      await prisma.user.create({
        data: {
          email: email?.toString()!,
          isConfirmed: false,
          role: 'Member',
          invitedUserId: clerkUser?.id,
          projects: {
            create: {
              project: {
                connect: {
                  id: savedProject.id,
                },
              },
            },
          },
        },
      });
    }

    if (
      adminMetaData.success &&
      inviteUserInfoData.success &&
      inviteUserData.success
    ) {
      return {
        success: true,
        message: 'Project created and user Invited successfully',
        createdProjectName: project[0].name,
        createdProjectId: project[0].id,
      };
    } else {
      return { success: false, message: 'Something went wrong' };
    }
  } else {
    if (inviteUserInfoData?.user?.public_metadata?.projects) {
      const alreadyExistedprojects = inviteUserInfoData?.user?.public_metadata
        ?.projects as Project[];

      userProjects = [...alreadyExistedprojects, ...project];
    } else {
      userProjects = project;
    }

    // put the userprojects to the already present user!

    const userMetaRes = await fetch(
      `${process.env.HOSTED_URL}/api/save-metadata`,
      {
        method: 'POST',
        body: JSON.stringify({
          isAdmin: false,
          userId: prevState.selectedUser?.clerkUserId,
          projects: userProjects,
        }),
      }
    );

    const userMetaData = await userMetaRes.json();

    if (userMetaData.success) {
      await prisma.user.create({
        data: {
          email: prevState.selectedUser?.email,
          isConfirmed: true,
          role: 'Member',
          invitedUserId: clerkUser?.id,
          username: prevState.selectedUser?.username,
          photo: prevState.selectedUser?.photo,
          clerkUserId: prevState.selectedUser?.clerkUserId,
          projects: {
            create: {
              project: {
                connect: {
                  id: savedProject.id,
                },
              },
            },
          },
        },
      });
    }

    if (userMetaData.success && inviteUserInfoData.success) {
      return {
        success: true,
        message: 'Project created and first user added successfully',
        createdProjectName: project[0].name,
        createdProjectId: project[0].id,
      };
    } else {
      return { success: false, message: 'Something went wrong' };
    }
  }
};
