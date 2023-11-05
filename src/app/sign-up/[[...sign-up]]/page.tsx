import { SignUp } from '@clerk/nextjs';
import React from 'react';

const SignUpPage = () => {
  return (
    <section className='flex items-center justify-center mt-10'>
      <SignUp />
    </section>
  );
};

export default SignUpPage;
