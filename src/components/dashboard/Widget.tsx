import { IconProps } from '@radix-ui/react-icons/dist/types';
import React, { Component } from 'react';

const Widget = ({
  widget,
}: {
  widget: {
    id: number;
    name: string;
    count: number;
    icon: React.ForwardRefExoticComponent<
      IconProps & React.RefAttributes<SVGSVGElement>
    >;
  };
}) => {
  return (
    <div className='border p-5 rounded-lg'>
      <div className='flex justify-between items-center'>
        <p>{widget.name}</p>
        <widget.icon className='h-5 w-5' />
      </div>
      <h1 className='text-2xl mt-2'>{widget.count}</h1>
    </div>
  );
};

export default Widget;
