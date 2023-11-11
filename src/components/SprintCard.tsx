import Link from 'next/link';
import React from 'react';

const SprintCard = ({ sprint, params }: { sprint: Sprint; params: Params }) => {
  return (
    <Link
      href={`/${params.projectId}/${params.projectName}/sprints/${sprint.id}`}
    >
      <div className='border p-3 rounded-lg'>
        <h1 className='text-2xl'>{sprint.sprintName}</h1>
        <p className='mt-2'>Created By: {sprint.createdUserName}</p>
        <p className='mt-2'>
          Ended Date : {new Date(sprint.endDate).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};

export default SprintCard;
