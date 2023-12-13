import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const navLinks = (
  projectId: string,
  projectName: string,
  isAdmin: boolean
) => {
  let navLinks: { id: number; name: string; link: string }[] = [];

  if (isAdmin) {
    navLinks = [
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
        name: 'Board',
        link: `/${projectId}/${projectName}/board`,
      },
      {
        id: 4,
        name: 'Sprints',
        link: `/${projectId}/${projectName}/sprints`,
      },
      {
        id: 5,
        name: 'Users',
        link: `/${projectId}/${projectName}/users`,
      },
      {
        id: 6,
        name: 'Settings',
        link: `/${projectId}/${projectName}/settings`,
      },
    ];
  } else {
    navLinks = [
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
        name: 'Board',
        link: `/${projectId}/${projectName}/board`,
      },
      {
        id: 4,
        name: 'Sprints',
        link: `/${projectId}/${projectName}/sprints`,
      },
      {
        id: 5,
        name: 'Settings',
        link: `/${projectId}/${projectName}/settings`,
      },
    ];
  }
  return navLinks;
};

export const imageFormats = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
