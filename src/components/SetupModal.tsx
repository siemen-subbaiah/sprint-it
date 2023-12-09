'use client';

import React, { useEffect, useState } from 'react';
import { useFormStatus, useFormState } from 'react-dom';
import { setupAction } from '@/actions/setup';
import { redirect } from 'next/navigation';
import { useToast } from './ui/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialState: {
  success?: boolean | null;
  message?: string | null;
  createdProjectId?: string | null;
  createdProjectName?: string | null;
  selectedUser?: PrismaUser | null;
} = {
  success: null,
  message: null,
  selectedUser: null,
};

const SetupModal = ({
  showOtherUsers,
  allUsers,
}: {
  showOtherUsers: boolean;
  allUsers: PrismaUser[];
}) => {
  const { toast } = useToast();
  const { pending } = useFormStatus();

  const [state, formAction] = useFormState(setupAction, initialState);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    console.log(state);

    if (state.success === true) {
      toast({
        variant: 'default',
        title: state.message,
      });
      setDialogOpen(false);
      redirect(
        `/${state.createdProjectId}/${state.createdProjectName}/dashboard`
      );
    }

    if (state.success === false) {
      toast({
        variant: 'destructive',
        title: state.message,
      });
      setDialogOpen(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <section className='mt-4'>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>Create</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <form className='grid gap-4 py-4' action={formAction}>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                required
                name='projectName'
                placeholder='Name of your first project'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Prefix
              </Label>
              <Input
                required
                name='projectPrefix'
                className='col-span-3'
                placeholder='Prefix of the project'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                Email
              </Label>
              <Input
                name='email'
                placeholder='Email ID of your first team member'
                className='col-span-3'
              />
            </div>
            {showOtherUsers && allUsers.length >= 1 && (
              <>
                <Separator className='mt-4' />
                <p className='text-center'>
                  or select existing user instead of email invite
                </p>
                <section className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='username' className='text-right'>
                    User
                  </Label>
                  <Select>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Existing user' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Users</SelectLabel>
                        {allUsers.map((item) => {
                          return (
                            <SelectItem
                              value={item.username!}
                              key={item.id}
                              onSelect={() => {
                                initialState.selectedUser = item;
                              }}
                            >
                              {item.username}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </section>
              </>
            )}
            <DialogFooter>
              <Button type='submit' aria-disabled={pending}>
                {pending ? 'Loading...' : 'Create and Invite'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SetupModal;
