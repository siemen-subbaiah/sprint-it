import Board from '@/components/Board';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import prisma from '@/config/db';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';

export const revalidate = 0;

const BoardPage = async ({ params }: { params: Params }) => {
  const clerkUser = await currentUser();

  const sprints = await prisma.sprint.findMany({
    where: {
      projectId: params.projectId,
      AND: {
        isInProgress: true,
      },
    },
  });

  // if more than one sprint is active, need to somehow ask the user to select the sprint to the view the board!

  const currentSprintTasks = await prisma.task.findMany({
    where: {
      isInBacklog: false,
      AND: {
        // assignedUserId: clerkUser?.id,
        sprintId: sprints[0]?.id,
      },
    },
  });

  const allUsers = await prisma.user.findMany();

  const modCurrentSprintTasks = currentSprintTasks.map((task) => {
    const findUser = allUsers.find(
      (user) => user.clerkUserId === task.assignedUserId
    );
    return {
      ...task,
      assignedUserPic: findUser?.photo!,
      assignedUserName:
        clerkUser?.id === task.assignedUserId
          ? `${findUser?.username!} (Me)`
          : findUser?.username!,
    };
  });

  // for the separation of tasks based on users!
  const obj: any = {};

  const output: {
    name: string;
    tasks: Task[];
    position: number;
  }[] = [];
  for (let i = 0; i < modCurrentSprintTasks.length; i++) {
    if (!obj[modCurrentSprintTasks[i].assignedUserName]) {
      obj[modCurrentSprintTasks[i].assignedUserName] = [
        modCurrentSprintTasks[i],
      ];
    } else {
      obj[modCurrentSprintTasks[i].assignedUserName].push(
        modCurrentSprintTasks[i]
      );
    }
  }

  const compareUserName = clerkUser?.username
    ? `${clerkUser?.username} (Me)`
    : `${clerkUser?.firstName} (Me)`;

  for (let key in obj) {
    output.push({
      name: key,
      tasks: obj[key],
      position: compareUserName === key ? 1 : 2,
    });
  }

  return (
    <>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl'>My Board</h1>
        <Button>
          <Link
            href={`/${params.projectId}/${params.projectName}/board/add-task`}
          >
            Add task
          </Link>
        </Button>
      </div>

      <section className='mt-10 grid grid-cols-4 gap-5'>
        <div className='px-3 py-1 rounded-md bg-[#04A964] text-black w-1/3'>
          <p className='text-center'>To do</p>
        </div>
        <div className='px-3 py-1 rounded-md bg-[#2E69BD]  w-2/5'>
          <p className='text-center'>In Progress</p>
        </div>
        <div className='px-3 py-1 rounded-md bg-[#BD9E2E] w-1/3'>
          <p className='text-center'>Blocked</p>
        </div>
        <div className='px-3 py-1 rounded-md bg-[#0072F5] w-1/3'>
          <p className='text-center'>Done</p>
        </div>
      </section>

      <div className='mt-10'>
        {output
          .sort((a, b) => a.position - b.position)
          .map((item, i) => {
            return (
              <section key={i} className='mt-8'>
                <Badge className='text-sm'>{item.name}</Badge>
                <Board
                  finalCurrentSprintTasks={item.tasks}
                  params={params}
                  currentUser={clerkUser?.id!}
                />
                <Separator />
              </section>
            );
          })}
      </div>
    </>
  );
};

export default BoardPage;
