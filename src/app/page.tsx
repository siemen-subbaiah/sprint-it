import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage = () => {
  return (
    <>
      <section className='flex items-center'>
        <div>
          <section>
            <h1 className='text-4xl md:text-7xl md:mt-20 mt-32 md:w-1/2 md:leading-normal'>
              The ONLY Sprint app you need
            </h1>
            <p className='mt-4 md:text-2xl'>
              Introducing ‘Sprint it’, manage all sprint related things here
            </p>
          </section>
          <section className='mt-7 flex items-center gap-4'>
            <Button asChild>
              <Link href='/sign-in'>Login</Link>
            </Button>
            <Button asChild variant='secondary'>
              <Link href='/sign-up'>Sign up</Link>
            </Button>
          </section>
        </div>
        <div className='hidden md:block'>
          <Image
            src='/landing-image.svg'
            alt='landing'
            width='500'
            height='500'
            placeholder='blur'
            blurDataURL='/landing-image.svg'
          />
        </div>
      </section>
    </>
  );
};

export default LandingPage;
