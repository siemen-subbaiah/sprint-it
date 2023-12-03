'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SprintSelection = ({
  sprints,
  currentSprintName,
  params,
}: {
  sprints: Sprint[];
  currentSprintName: string;
  params: Params;
}) => {
  const router = useRouter();

  const handleChangeProject = (sprintId: number, sprintName: string) => {
    router.push(
      `/${params.projectId}/${params.projectName}/board?sprintId=${sprintId}&sprintName=${sprintName}`
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex items-center gap-1'>
          {currentSprintName}
          <ChevronsUpDown className='h-4 w-4' />
          <span className='sr-only'>Toggle</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel>Select Project</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sprints?.map((sprint, i) => {
          return (
            <DropdownMenuCheckboxItem
              checked={sprint.sprintName === currentSprintName}
              key={i}
              onSelect={() => handleChangeProject(sprint.id, sprint.sprintName)}
            >
              {sprint.sprintName}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SprintSelection;
