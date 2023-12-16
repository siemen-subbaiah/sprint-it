import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import prisma from '@/config/db';

export const POST = async (request: Request) => {
  const user = await currentUser();
  const {
    projectName,
    projectPrefix,
  }: { projectName: string; projectPrefix: string } = await request.json();
  try {
    const savedProject = await prisma.project.create({
      data: {
        createdUserId: user?.id!,
        createdUserName: user?.username! ? user?.username! : user?.firstName!,
        name: projectName?.toString()!,
        prefix: projectPrefix?.toString()!,
        users: {
          create: {
            user: {
              create: {
                email: user?.emailAddresses[0].emailAddress!,
                isConfirmed: true,
                role: 'Admin',
                username: user?.username! ? user?.username! : user?.firstName!,
                photo: user?.imageUrl,
                clerkUserId: user?.id,
              },
            },
          },
        },
      },
    });

    const project = [
      {
        id: savedProject.uniqueId,
        name: savedProject.name,
        prefix: savedProject.prefix,
        createdUserId: savedProject.createdUserId,
        createdUserName: savedProject.createdUserName,
      },
    ];

    let adminProjects = user?.publicMetadata?.projects as Project[];

    if (adminProjects) {
      adminProjects = [...adminProjects, ...project];
    } else {
      adminProjects = project;
    }

    if (savedProject) {
      return NextResponse.json({
        success: true,
        message: 'Project successfully created',
        adminProjects,
        userId: user?.id,
        project: project,
        projectId: savedProject.id,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Something went wrong when creating project',
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: 'Something went wrong when creating project',
      error,
    });
  }
};
