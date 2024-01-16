import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sign In',
};

const SignInPage = () => {
  return (
    <section className='flex items-center justify-center mt-10'>
      <SignIn />
    </section>
  );
};

export default SignInPage;
