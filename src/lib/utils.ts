import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const navLinks = (projectId: string, projectName: string) => {
  const navLinks = [
    {
      id: 1,
      name: 'Dashboard',
      link: `/${projectId}/${projectName}/dashboard`,
    },
    {
      id: 2,
      name: 'Backlog',
      link: `/${projectId}/${projectName}/backlog`,
    },
    {
      id: 3,
      name: 'Settings',
      link: `/${projectId}/${projectName}/settings`,
    },
  ];
  return navLinks;
};
