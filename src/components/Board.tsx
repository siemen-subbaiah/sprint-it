'use client';

import { Status } from '@/constants/dropdowns';
import React, { DragEvent, useState } from 'react';
import TaskCard from './cards/TaskCard';
import { reArrangeTasks } from '@/actions/rearrange';

const Board = ({
  finalCurrentSprintTasks,
  params,
  currentUser,
}: {
  finalCurrentSprintTasks: Task[];
  params: Params;
  currentUser: string;
}) => {
  const [capturedTask, setCapturedTask] = useState<Task | null>(null);

  const handleonDrop = async (status: number) => {
    if (capturedTask) {
      reArrangeTasks(capturedTask, status, params);
    }
  };

  const handleonDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <section className='mt-4 grid grid-cols-4 gap-5'>
      <div
        onDrop={() => handleonDrop(1)}
        onDragOver={(event) => handleonDragOver(event)}
      >
        <div>
          {finalCurrentSprintTasks
            .filter((item) => item.status === Status['To do'])
            .map((task) => {
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  params={params}
                  setCapturedTask={setCapturedTask}
                  currentUser={currentUser}
                />
              );
            })}
        </div>
      </div>
      <div
        onDrop={() => handleonDrop(2)}
        onDragOver={(event) => handleonDragOver(event)}
      >
        <div>
          {finalCurrentSprintTasks
            .filter((item) => item.status === Status['In progress'])
            .map((task) => {
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  params={params}
                  setCapturedTask={setCapturedTask}
                  currentUser={currentUser}
                />
              );
            })}
        </div>
      </div>
      <div
        onDrop={() => handleonDrop(3)}
        onDragOver={(event) => handleonDragOver(event)}
      >
        <div>
          {finalCurrentSprintTasks
            .filter((item) => item.status === Status['Blocked'])
            .map((task) => {
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  params={params}
                  setCapturedTask={setCapturedTask}
                  currentUser={currentUser}
                />
              );
            })}
        </div>
      </div>
      <div
        onDrop={() => handleonDrop(4)}
        onDragOver={(event) => handleonDragOver(event)}
      >
        <div>
          {finalCurrentSprintTasks
            .filter((item) => item.status === Status['Done'])
            .map((task) => {
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  params={params}
                  setCapturedTask={setCapturedTask}
                  currentUser={currentUser}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Board;
