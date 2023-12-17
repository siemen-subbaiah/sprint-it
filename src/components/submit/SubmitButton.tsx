'use client';

import React from 'react';
import { Button } from '../ui/button';
import { useFormStatus } from 'react-dom';

const SubmitButton = ({ title }: { title: string }) => {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending}>
      {pending ? 'Loading...' : title}
    </Button>
  );
};

export default SubmitButton;
