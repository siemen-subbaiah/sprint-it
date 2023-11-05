import { currentUser } from '@clerk/nextjs';
import React from 'react';
import ProjectSelection from './ProjectSelection';
import NavLinks from './NavLinks';

const Header = async () => {
  const user = await currentUser();
  const projects = user?.publicMetadata?.projects as Project[];

  return (
    <nav
      className={`${
        user?.id ? 'md:flex' : 'flex'
      } items-center px-4 md:px-20 pb-3 pt-5 border-b justify-between sticky top-0 bg-[#0A0A0A]`}
    >
      <ProjectSelection projects={projects} userId={user?.id!} />
      <NavLinks userId={user?.id!} />
    </nav>
  );
};

export default Header;
