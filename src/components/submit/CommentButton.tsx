import React from 'react';
import { Button } from '../ui/button';
import { useFormStatus } from 'react-dom';

const CommentButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' className='mt-5' disabled={pending}>
      Comment
    </Button>
  );
};

export default CommentButton;
