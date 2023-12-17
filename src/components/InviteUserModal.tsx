'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from './ui/use-toast';

const InviteUserModal = ({
  currentProject,
  currentUserId,
}: {
  currentProject: PrismaProject;
  currentUserId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleEmailInvite = async () => {
    setLoading(true);
    const checkUserExistsRes = await fetch(`/api/get-user?email=${email}`);

    const checkUserExistsData = await checkUserExistsRes.json();

    const project: Project[] = [
      {
        id: currentProject.uniqueId,
        name: currentProject.name,
        prefix: currentProject.prefix,
        createdUserName: currentProject.createdUserName,
        createdUserId: currentProject.createdUserId,
      },
    ];

    let userProjects: Project[];

    if (checkUserExistsData.firstTimeUser) {
      userProjects = project;
    } else {
      if (checkUserExistsData?.user?.public_metadata?.projects) {
        const alreadyExistedprojects = checkUserExistsData?.user
          ?.public_metadata?.projects as Project[];

        userProjects = [...alreadyExistedprojects, ...project];
      } else {
        userProjects = project;
      }
    }

    const inviteUserRes = await fetch('/api/invite-user', {
      method: 'POST',
      body: JSON.stringify({
        email,
        projects: userProjects,
      }),
    });

    const inviteUserData = await inviteUserRes.json();

    if (inviteUserData.success) {
      await fetch('/api/save-unconfirmed-user', {
        method: 'POST',
        body: JSON.stringify({
          email,
          currentUserId,
          currentProject: currentProject.id,
          projects: userProjects,
        }),
      });

      toast({
        variant: 'default',
        title: 'Invited user successfully',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong while inviting user',
      });
    }

    setOpen(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite User</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            className='mt-2'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button type='submit' onClick={handleEmailInvite} disabled={loading}>
            {loading ? 'Loading...' : 'Invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
