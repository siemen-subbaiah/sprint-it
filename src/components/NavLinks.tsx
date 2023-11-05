'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { navLinks } from '@/lib/utils';
import { Menu } from 'lucide-react';

const NavLinks = ({ userId }: { userId: string | null }) => {
  const [toggle, setToggle] = useState(false);

  const params = useParams();

  const currentProjectName = params.projectName as string;
  const currentProjectId = params.projectId as string;

  return (
    <>
      {!userId && (
        <ul className='flex items-center gap-4'>
          <Link href='/sign-in'>
            <li>Login</li>
          </Link>
          <Link href='/sign-up'>
            <li>Sign up</li>
          </Link>
        </ul>
      )}
      {userId && (
        <>
          {toggle && (
            <ul className='md:hidden'>
              {navLinks(currentProjectId, currentProjectName).map((item) => {
                return (
                  <li key={item.id} className='my-3'>
                    <Link href={item.link}>{item.name}</Link>
                  </li>
                );
              })}
              <li>
                <UserButton afterSignOutUrl='/' />
              </li>
            </ul>
          )}
          <Menu
            className='md:hidden absolute right-[10px] top-[30px]'
            onClick={() => setToggle(!toggle)}
          />
          <ul className='items-center gap-4 md:flex hidden'>
            {navLinks(currentProjectId, currentProjectName).map((item) => {
              return (
                <li key={item.id}>
                  <Link href={item.link}>{item.name}</Link>
                </li>
              );
            })}
            <li>
              <UserButton afterSignOutUrl='/' />
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default NavLinks;
