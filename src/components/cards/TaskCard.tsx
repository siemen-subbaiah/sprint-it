'use client';

import Link from 'next/link';
import React, { DragEvent } from 'react';
import { Separator } from '../ui/separator';
import { PriorityColor, Type } from '@/constants/dropdowns';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const TaskCard = ({
  task,
  params,
  setCapturedTask,
  currentUser,
}: {
  task: Task;
  params: Params;
  setCapturedTask?: any;
  currentUser?: string;
}) => {
  const handleonDrag = (e: DragEvent<HTMLDivElement>, task: Task) => {
    e.preventDefault();
    setCapturedTask(task);
  };

  return (
    <Link
      href={`/${params.projectId}/${params.projectName}/backlog/${task.id}`}
    >
      <div
        className={`border p-5 rounded-lg ${
          currentUser === task.assignedUserId && 'cursor-grab'
        }`}
        style={{ marginBottom: setCapturedTask ? '20px' : '0' }}
        draggable={currentUser === task.assignedUserId}
        onDrag={(e) => {
          handleonDrag(e, task);
        }}
      >
        <section className='md:flex justify-between items-center'>
          <h1 className='text-xl'>{task.itemName}</h1>
          <div
            className='mt-2 md:mt-0'
            style={{
              height: '10px',
              width: '14px',
              borderRadius: '100px',
              backgroundColor: PriorityColor[task.priority],
            }}
          ></div>
        </section>
        <Separator className='my-3' />
        <section className='flex justify-between items-center'>
          <p>
            Points : {task.estimatedPoints} | Item Type : {Type[task.itemType]}
          </p>
          <Avatar>
            <AvatarImage
              src={task?.assignedUserPic}
              alt={task?.assignedUserName}
            />
            <AvatarFallback>
              {task?.assignedUserName?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </section>
      </div>
    </Link>
  );
};

export default TaskCard;
