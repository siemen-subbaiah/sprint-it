import Link from 'next/link';
import React from 'react';
import { Badge } from '../ui/badge';

const SprintCard = ({ sprint, params }: { sprint: Sprint; params: Params }) => {
  return (
    <Link
      href={`/${params.projectId}/${params.projectName}/sprints/${sprint.id}`}
    >
      <div className='border p-5 rounded-lg'>
        <div className='flex justify-between'>
          <h1 className='text-2xl'>{sprint.sprintName}</h1>
          {sprint.isInProgress && <Badge>Active</Badge>}
        </div>
        <p className='mt-2'>Created By: {sprint.createdUserName}</p>
        <p className='mt-2'>
          {sprint.isInProgress ? 'End' : 'Ended'} Date :{' '}
          {new Date(sprint.endDate).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};

export default SprintCard;
