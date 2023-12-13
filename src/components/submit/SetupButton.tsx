import React from 'react';
import { Button } from '../ui/button';
import { useFormStatus } from 'react-dom';

const SetupButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' disabled={pending}>
      Create and Invite
    </Button>
  );
};

export default SetupButton;
