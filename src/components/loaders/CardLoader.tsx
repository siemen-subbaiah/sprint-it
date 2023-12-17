import React from 'react';

const CardLoader = () => {
  return (
    <section className='grid md:grid-cols-3 grid-cols-1 gap-8'>
      <div
        role='status'
        className='max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700'
      >
        <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4' />
        <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5' />
        <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5' />
        <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700' />
        <span className='sr-only'>Loading...</span>
      </div>
      <div
        role='status'
        className='max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700'
      >
        <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4' />
        <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5' />
        <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5' />
        <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700' />
        <span className='sr-only'>Loading...</span>
      </div>
      <div
        role='status'
        className='max-w-sm p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700'
      >
        <div className='h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4' />
        <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5' />
        <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5' />
        <div className='h-2 bg-gray-200 rounded-full dark:bg-gray-700' />
        <span className='sr-only'>Loading...</span>
      </div>
    </section>
  );
};

export default CardLoader;
