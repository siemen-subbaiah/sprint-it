'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Separator } from './ui/separator';
import { User } from '@prisma/client';

const SetupModal = ({
  showOtherUsers,
  allUsers,
}: {
  showOtherUsers: boolean;
  allUsers: PrismaUser[];
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectPrefix, setprojectPrefix] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateNewProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const saveProjectRes = await fetch(`/api/save-project`, {
      method: 'POST',
      body: JSON.stringify({
        projectName,
        projectPrefix,
      }),
    });

    const saveProjectData = await saveProjectRes.json();

    if (saveProjectData.success) {
      toast({
        variant: 'default',
        title: saveProjectData.message,
      });

      const adminMetaRes = await fetch(`/api/save-metadata`, {
        method: 'POST',
        body: JSON.stringify({
          isAdmin: true,
          userId: saveProjectData?.userId,
          projects: saveProjectData.adminProjects,
        }),
      });

      const adminMetaData = await adminMetaRes.json();

      if (adminMetaData.success) {
        toast({
          variant: 'default',
          title: adminMetaData.message,
        });

        const checkUserExistsRes = await fetch(
          `/api/get-user?email=${selectedUser ? selectedUser : email}`
        );

        const checkUserExistsData = await checkUserExistsRes.json();

        let userProjects: Project[];

        if (checkUserExistsData.firstTimeUser) {
          userProjects = saveProjectData.project;
        } else {
          if (checkUserExistsData?.user?.public_metadata?.projects) {
            const alreadyExistedprojects = checkUserExistsData?.user
              ?.public_metadata?.projects as Project[];

            userProjects = [
              ...alreadyExistedprojects,
              ...saveProjectData.project,
            ];
          } else {
            userProjects = saveProjectData.project;
          }
        }

        if (checkUserExistsData.success) {
          toast({
            variant: 'default',
            title: 'Email looked up successfully',
          });

          if (checkUserExistsData.firstTimeUser) {
            const inviteUserRes = await fetch('/api/invite-user', {
              method: 'POST',
              body: JSON.stringify({
                email,
                projects: userProjects,
              }),
            });

            const inviteUserData = await inviteUserRes.json();

            if (inviteUserData.success) {
              toast({
                variant: 'default',
                title: inviteUserData.message,
              });

              await fetch('/api/save-unconfirmed-user', {
                method: 'POST',
                body: JSON.stringify({
                  email,
                  currentUserId: saveProjectData?.userId,
                  currentProject: saveProjectData.projectId,
                  projects: userProjects,
                }),
              });

              // final!
              setLoading(false);
              setDialogOpen(false);
              router.push(
                `/${saveProjectData.project[0].id}/${saveProjectData.project[0].name}/dashboard`
              );
            } else {
              toast({
                variant: 'destructive',
                title: inviteUserData.message,
              });
              setDialogOpen(false);
              setLoading(false);
            }
          } else {
            // adding an existing user to a new project!

            const userMetaRes = await fetch(`/api/save-metadata`, {
              method: 'POST',
              body: JSON.stringify({
                isAdmin: false,
                userId: checkUserExistsData?.user?.id,
                projects: userProjects,
              }),
            });

            const userMetaData = await userMetaRes.json();

            if (userMetaData.success) {
              toast({
                variant: 'default',
                title: 'Project created successfully and added existing user',
              });

              const userRes = await fetch('/api/save-confirmed-user', {
                method: 'POST',
                body: JSON.stringify({
                  selectedUser: checkUserExistsData?.user,
                  currentUserId: saveProjectData?.userId,
                  currentProject: saveProjectData.projectId,
                }),
              });

              const userData = await userRes.json();

              // final!
              if (userData.success) {
                setLoading(false);
                setDialogOpen(false);
                router.push(
                  `/${saveProjectData.project[0].id}/${saveProjectData.project[0].name}/dashboard`
                );
              }
            } else {
              toast({
                variant: 'destructive',
                title: userMetaData.message,
              });
            }
          }
        } else {
          toast({
            variant: 'destructive',
            title: 'Something went wrong when performing email lookup',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: adminMetaData.message,
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: saveProjectData.message,
      });
    }
  };

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
          <form className='grid gap-4 py-4' onSubmit={handleCreateNewProject}>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                required
                name='projectName'
                placeholder='Name of your first project'
                className='col-span-3'
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
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
                value={projectPrefix}
                onChange={(e) => setprojectPrefix(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  <Select
                    onValueChange={(value) => {
                      setSelectedUser(value);
                    }}
                  >
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Existing user' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Users</SelectLabel>
                        {allUsers.map((item) => {
                          return (
                            <SelectItem value={item.email} key={item.id}>
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
              <Button type='submit' disabled={loading}>
                {loading ? 'Loading...' : 'Create and Invite'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SetupModal;
