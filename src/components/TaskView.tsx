import React from 'react';
import { Separator } from './ui/separator';
import { Priority, Status, Type } from '@/constants/dropdowns';
import { Button } from './ui/button';
import Link from 'next/link';
import { Input } from './ui/input';
import { currentUser } from '@clerk/nextjs';
import prisma from '@/config/db';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { revalidatePath } from 'next/cache';
import Image from 'next/image';
import { imageFormats } from '@/lib/utils';

const TaskView = async ({
  finalTask,
  params,
}: {
  finalTask: Task;
  params: Params;
}) => {
  const user = await currentUser();

  const handleCommenting = async (formData: FormData) => {
    'use server';
    const comment = formData.get('comment')?.toString()!;
    const taskId = finalTask?.id;
    const createdUserId = user?.id!;
    const createdUserName = user?.username ? user?.username! : user?.firstName!;
    const createdUserPic = user?.imageUrl!;

    await prisma.comment.create({
      data: {
        createdUserId,
        createdUserName,
        createdUserPic,
        comment,
        task: {
          connect: {
            id: taskId,
          },
        },
      },
    });
    revalidatePath(
      `/${params.projectId}/${params.projectName}/backlog/${params.id}`
    );
  };

  return (
    <section className='mb-10'>
      <section className='flex items-center justify-between'>
        <h1 className='text-2xl'>{finalTask?.itemName}</h1>
        <Link
          className='hidden md:block'
          href={`/${params.projectId}/${params.projectName}/backlog/edit/${params.id}`}
        >
          <Button>Edit task</Button>
        </Link>
      </section>
      <section className='flex gap-3 items-baseline'>
        <h2 className='text-xl mt-4'>
          Created By : {finalTask?.createdUserName}
        </h2>
        <p className='text-[#A89E9E]'>
          {new Date(finalTask?.createdAt).toLocaleDateString()}
        </p>
      </section>
      <Link
        className='md:hidden block mt-2'
        href={`/${params.projectId}/${params.projectName}/backlog/edit/${params.id}`}
      >
        <Button>Edit task</Button>
      </Link>
      <Separator className='my-6' />
      <h1 className='text-2xl text-[#0072F5]'>Basic Details</h1>
      <p className='mt-4'>Project Name : {finalTask?.projectName}</p>
      <p className='mt-4'>Associated Sprint : {finalTask?.sprintName}</p>
      <p className='mt-4'>Assigned User : {finalTask?.assignedUserName}</p>
      <p className='mt-4'>Status : {Status[finalTask?.status]}</p>
      <p className='mt-4'>Priority : {Priority[finalTask?.priority]}</p>
      <p className='mt-4'>Item Type : {Type[finalTask?.itemType]}</p>
      <p className='mt-4'>Estimation Points : {finalTask?.estimatedPoints}</p>
      <h1 className='text-2xl text-[#0072F5] my-6'>Description</h1>
      <p className='mt-4'>{finalTask?.itemDescription}</p>
      <h1 className='text-2xl text-[#0072F5] my-6'>Attachments</h1>
      <div className='flex gap-5'>
        {finalTask?.attachments?.map((attachment) => {
          return (
            <div key={attachment.id} className='my-5'>
              {imageFormats.includes(attachment.attachmentExtension) && (
                <Image
                  src={attachment.attachmentLink}
                  blurDataURL={attachment.attachmentLink}
                  placeholder='blur'
                  alt='task_image'
                  height={250}
                  width={250}
                />
              )}
              {attachment.attachmentExtension === 'pdf' && (
                <Image
                  src='/pdf-logo.svg'
                  alt='landing'
                  width='200'
                  height='200'
                  placeholder='blur'
                  blurDataURL='/pdf-logo.svg'
                />
              )}
              {attachment.attachmentExtension === 'doc' && (
                <Image
                  src='/doc-logo.svg'
                  alt='landing'
                  width='200'
                  height='200'
                  placeholder='blur'
                  blurDataURL='/doc-logo.svg'
                />
              )}
            </div>
          );
        })}
      </div>

      {/* comments */}

      <h1 className='text-2xl text-[#0072F5] my-6'>Comments</h1>

      <section className='mt-5'>
        {finalTask?.comments?.map((item) => {
          return (
            <div key={item.id} className='mt-6'>
              <section className='flex gap-4 items-center'>
                <Avatar>
                  <AvatarImage
                    src={item?.createdUserPic!}
                    alt={item?.createdUserName}
                  />
                  <AvatarFallback>
                    {item?.createdUserName?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <h1 className='text-xl'>{item?.createdUserName}</h1>
              </section>
              <p className='mt-3'>{item?.comment}</p>
              <p className='mt-2 text-sm text-[#4B4949]'>
                {new Date(item?.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </section>

      <form className='mt-5' action={handleCommenting}>
        <Input
          required
          name='comment'
          placeholder='Enter your comment here'
          className='mt-2 w-2/6'
        />
        <Button type='submit' className='mt-5'>
          Comment
        </Button>
      </form>
    </section>
  );
};

export default TaskView;
