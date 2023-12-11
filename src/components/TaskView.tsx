import React from 'react';
import { Separator } from './ui/separator';
import { Priority, Status, Type } from '@/constants/dropdowns';
import { Button } from './ui/button';
import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';
import prisma from '@/config/db';
import Image from 'next/image';
import { imageFormats } from '@/lib/utils';
import { TrashIcon, Pencil2Icon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import { redirect } from 'next/navigation';
import Comments from './Comments';
import Attachments from './Attachments';
const TaskView = async ({
  finalTask,
  params,
  userId,
  navigate,
}: {
  finalTask: Task;
  params: Params;
  userId: string;
  navigate: string;
}) => {
  const user = await currentUser();

  const handleDeleteTask = async () => {
    'use server';
    await prisma.task.delete({
      where: {
        id: finalTask.id,
      },
    });
    redirect(`/${params.projectId}/${params.projectName}/backlog`);
  };

  return (
    <section className='mb-10'>
      <section className='flex items-center justify-between'>
        <h1 className='text-2xl'>{finalTask?.itemName}</h1>
        {(userId === finalTask?.createdUserId ||
          userId === finalTask?.assignedUserId) && (
          <div className='flex gap-2'>
            <Link
              className='hidden md:block'
              href={`/${params.projectId}/${params.projectName}/${navigate}/edit/${params.id}`}
            >
              <Button>
                Edit task
                <Pencil2Icon className='h-4 w-4 ml-2' />
              </Button>
            </Link>
            <div className='hidden md:block'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='destructive'>
                    Delete Task
                    <TrashIcon className='h-4 w-4 ml-2' />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                  <AlertDialogOverlay />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently the
                        task.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form action={handleDeleteTask}>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button type='submit'>Delete</Button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogContent>
                </AlertDialogPortal>
              </AlertDialog>
            </div>
          </div>
        )}
      </section>
      <section className='flex gap-3 items-baseline'>
        <h2 className='text-xl mt-4'>
          Created By : {finalTask?.createdUserName}
        </h2>
        <p className='text-[#A89E9E]'>
          {new Date(finalTask?.createdAt).toLocaleDateString()}
        </p>
      </section>
      <section className='flex gap-2'>
        <Link
          className='md:hidden block mt-2'
          href={`/${params.projectId}/${params.projectName}/${navigate}/edit/${params.id}`}
        >
          <Button>Edit task</Button>
        </Link>
        <div className='md:hidden block mt-2'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                Delete Task
                <TrashIcon className='h-4 w-4 ml-2' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogPortal>
              <AlertDialogOverlay />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently the
                    task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form action={handleDeleteTask}>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type='submit'>Delete</Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialogPortal>
          </AlertDialog>
        </div>
      </section>
      <Separator className='my-6' />
      <h1 className='text-2xl text-[#0072F5]'>Basic Details</h1>
      <p className='mt-4'>Project Name : {finalTask?.projectName}</p>
      <p className='mt-4'>Associated Sprint : {finalTask?.sprintName}</p>
      <p className='mt-4'>Assigned User : {finalTask?.assignedUserName}</p>
      <p className='mt-4'>Status : {Status[finalTask?.status]}</p>
      <p className='mt-4'>Priority : {Priority[finalTask?.priority]}</p>
      <p className='mt-4'>Item Type : {Type[finalTask?.itemType]}</p>
      <p className='mt-4'>Estimation Points : {finalTask?.estimatedPoints}</p>
      <Separator className='my-4' />
      <h1 className='text-2xl text-[#0072F5] my-6'>Description</h1>
      <div
        className='mt-4'
        dangerouslySetInnerHTML={{ __html: finalTask?.itemDescription }}
      ></div>
      <Separator className='my-4' />
      <h1 className='text-2xl text-[#0072F5] my-6'>Attachments</h1>
      <Attachments attachments={finalTask?.attachments!} />

      {/* comments */}
      <Separator className='my-4' />

      <h1 className='text-2xl text-[#0072F5] my-6'>Comments</h1>

      <Comments
        comments={finalTask?.comments!}
        taskId={finalTask?.id}
        params={params}
        userId={user?.id!}
      />
    </section>
  );
};

export default TaskView;
