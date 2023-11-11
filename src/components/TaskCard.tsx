import Link from 'next/link';
import React from 'react';
import { Separator } from './ui/separator';

const TaskCard = ({ task, params }: { task: Task; params: Params }) => {
  return (
    <Link
      href={`/${params.projectId}/${params.projectName}/sprints/${task.id}`}
    >
      <div className='border p-3 rounded-lg'>
        <h1 className='text-xl'>{task.itemName}</h1>
        <Separator className='my-3' />
        <p>
          Points : {task.estimatedPoints} | Item Type : {task.itemType}
        </p>
      </div>
    </Link>
  );
};

export default TaskCard;
