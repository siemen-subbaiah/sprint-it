import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import notFoundImg from '../../public/not-found.svg';

const NotFoundPage = () => {
  return (
    <section className='flex items-center flex-col my-5'>
      <Image
        src={notFoundImg}
        alt='landing'
        className='mt-10'
        width={500}
        height={500}
      />
      <h1 className='text-2xl mt-5'>Oops! Page not found.</h1>
      <Button asChild className='mt-5'>
        <Link href='/'>Home</Link>
      </Button>
    </section>
  );
};

export default NotFoundPage;
