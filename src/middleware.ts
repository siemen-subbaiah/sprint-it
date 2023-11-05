import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware

export default authMiddleware({
  publicRoutes: ['/'],

  afterAuth(auth, req, evt) {
    const metaData = auth.sessionClaims?.meta_data as any;
    const firstProject = auth.sessionClaims?.meta_data as any;

    if (auth.userId && req.nextUrl.pathname === '/') {
      if (!metaData?.hasOwnProperty('isAdmin')) {
        return NextResponse.redirect(new URL('/setup', req.url));
      }
      if (metaData?.hasOwnProperty('isAdmin')) {
        return NextResponse.redirect(
          new URL(
            `/${firstProject.projects[0].id}/${firstProject.projects[0].name}/dashboard`,
            req.url
          )
        );
      }
    }

    if (firstProject?.projects) {
      const allProjects = metaData?.projects?.map(
        (item: Project) => item.name
      ) as Array<string>;

      const urlProject = req.nextUrl.pathname.split('/')[2]?.toString();

      if (auth.userId && !allProjects?.includes(urlProject)) {
        return NextResponse.redirect(
          new URL(
            `/${firstProject.projects[0].id}/${firstProject.projects[0].name}/dashboard`,
            req.url
          )
        );
      }
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
