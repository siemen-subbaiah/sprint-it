'use client';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { points, priority, status, type } from '@/constants/dropdowns';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react';
import { useToast } from './ui/use-toast';

type Props = {
  isBacklog: boolean;
  users: PrismaUser[];
  sprints?: Sprint[];
  params: Params;
};

const TaskAddEdit = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const [formValues, setFormValues] = useState({
    itemName: '',
    itemDescription: '',
    assignedUserId: '',
    sprintId: '',
    status: '',
    itemType: '',
    priority: '',
    estimatedPoints: '',
  });

  const handleTaskCreateEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/save-task', {
      method: 'POST',
      body: JSON.stringify({
        ...formValues,
        projectId: props.params.projectId,
      }),
    });

    if (res.ok) {
      setLoading(false);
      const data = await res.json();

      if (data.success) {
        router.push(
          `/${props.params.projectId}/${props.params.projectName}/backlog`
        );
        toast({
          variant: 'default',
          title: data.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: data.message,
        });
      }
    }
  };

  return (
    <section>
      <h1 className='text-2xl'>Adding new Task</h1>

      <form className='my-8' onSubmit={handleTaskCreateEdit}>
        <div className='grid grid-cols-2 '>
          <section>
            <div>
              <Label htmlFor='taskName'>Task Name</Label>
              <Input
                required
                name='taskName'
                placeholder='Enter the task name'
                className='mt-2'
                value={formValues.itemName}
                onChange={(e) =>
                  setFormValues({ ...formValues, itemName: e.target.value })
                }
              />
            </div>
            <div className='mt-10'>
              <Label htmlFor='taskDescription'>Task Description</Label>
              <Textarea
                className='h-32 mt-2'
                name='taskDescription'
                value={formValues.itemDescription}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    itemDescription: e.target.value,
                  })
                }
              />
            </div>
            <Button className='mt-10' type='submit' disabled={loading}>
              {loading ? 'Loading...' : 'Save'}
            </Button>
          </section>
          <section className='ml-10'>
            <div>
              <Label htmlFor='assignUser'>Assign users</Label>
              <Select
                onValueChange={(value) =>
                  setFormValues({ ...formValues, assignedUserId: value })
                }
              >
                <SelectTrigger className='mt-2'>
                  <SelectValue placeholder='Select an option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>users</SelectLabel>
                    {props.users.map((item) => {
                      return (
                        <SelectItem key={item.id} value={item?.clerkUserId!}>
                          {item?.username}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {props.isBacklog && (
              <div className='mt-10'>
                <Label htmlFor='addTo'>Add to</Label>
                <Select
                  onValueChange={(value) =>
                    setFormValues({ ...formValues, sprintId: value })
                  }
                >
                  <SelectTrigger className='mt-2'>
                    <SelectValue placeholder='Select an option' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Add to</SelectLabel>
                      <SelectItem value='-1'>Backlog</SelectItem>
                      {props.sprints?.map((item) => {
                        return (
                          <SelectItem key={item.id} value={item?.id.toString()}>
                            {item?.sprintName}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className='mt-10'>
              <Label htmlFor='status'>Status</Label>
              <Select
                onValueChange={(value) =>
                  setFormValues({ ...formValues, status: value })
                }
              >
                <SelectTrigger className='mt-2'>
                  <SelectValue placeholder='Select an option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {status.map((item) => {
                      return (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='mt-10'>
              <Label htmlFor='itemType'>Item type</Label>
              <Select
                onValueChange={(value) =>
                  setFormValues({ ...formValues, itemType: value })
                }
              >
                <SelectTrigger className='mt-2'>
                  <SelectValue placeholder='Select an option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {type.map((item) => {
                      return (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='mt-10'>
              <Label htmlFor='priority'>Priority</Label>
              <Select
                onValueChange={(value) =>
                  setFormValues({ ...formValues, priority: value })
                }
              >
                <SelectTrigger className='mt-2'>
                  <SelectValue placeholder='Select an option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {priority.map((item) => {
                      return (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='mt-10'>
              <Label htmlFor='points'>Estimation Points</Label>
              <Select
                onValueChange={(value) =>
                  setFormValues({ ...formValues, estimatedPoints: value })
                }
              >
                <SelectTrigger className='mt-2'>
                  <SelectValue placeholder='Select an option' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Points</SelectLabel>
                    {points.map((item) => {
                      return (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </section>
        </div>
      </form>
    </section>
  );
};

export default TaskAddEdit;
