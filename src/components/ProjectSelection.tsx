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
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  projects: Project[];
  userId: string;
};

const ProjectSelection = (props: Props) => {
  const params = useParams();
  const router = useRouter();

  const currentProjectName = params.projectName as string;
  const currentProjectId = params.projectId as string;

  const handleChangeProject = (projectId: string, projectName: string) => {
    router.push(`/${projectId}/${projectName}/dashboard`);
  };

  return (
    <section className='flex items-center'>
      <Link href={`/${currentProjectId}/${currentProjectName}/dashboard`}>
        <Image src='/logo.svg' alt='logo' width='150' height='150' />
      </Link>

      {props?.userId && props?.projects?.length >= 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='flex items-center gap-1'>
              {currentProjectName}
              <ChevronsUpDown className='h-4 w-4' />
              <span className='sr-only'>Toggle</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56' align='start'>
            <DropdownMenuLabel>Select Project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {props?.projects?.map((project, i) => {
              return (
                <DropdownMenuCheckboxItem
                  checked={project.name === currentProjectName}
                  key={i}
                  onSelect={() => handleChangeProject(project.id, project.name)}
                >
                  {project.name}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </section>
  );
};

export default ProjectSelection;
