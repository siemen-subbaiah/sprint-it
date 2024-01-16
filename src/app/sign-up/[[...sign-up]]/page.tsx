import { SignUp } from '@clerk/nextjs';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sign Up',
};

const SignUpPage = () => {
  return (
    <section className='flex items-center justify-center mt-10'>
      <SignUp />
    </section>
  );
};

export default SignUpPage;
