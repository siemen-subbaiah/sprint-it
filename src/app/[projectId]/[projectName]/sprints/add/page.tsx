'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { PopoverTrigger } from '@radix-ui/react-popover';
import React, { FormEvent, useState } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

type Params = {
  projectId: string;
  projectName: string;
};

const AddSprintPage = ({ params }: { params: Params }) => {
  const [sprintName, setSprintName] = useState('');
  const [sprintDescription, setSprintDescription] = useState('');

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleSprintCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/save-sprint', {
      method: 'POST',
      body: JSON.stringify({
        sprintName,
        sprintDescription,
        startDate,
        endDate,
        projectId: params.projectId,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setLoading(false);
      router.push(`/${params.projectId}/${params.projectName}/sprints`);
      toast({
        variant: 'default',
        title: data.message,
      });
    } else {
      setLoading(false);

      toast({
        variant: 'destructive',
        title: data.message,
      });
    }
  };

  return (
    <section>
      <h1 className='text-2xl'>Adding new sprint</h1>

      <form className='my-8 w-2/4' onSubmit={handleSprintCreate}>
        <div>
          <Label htmlFor='sprintName'>Sprint Name</Label>
          <Input
            required
            name='sprintName'
            placeholder='Enter the sprint name'
            className='mt-2'
            value={sprintName}
            onChange={(e) => setSprintName(e.target.value)}
          />
        </div>
        <div className='mt-10'>
          <Label htmlFor='sprintDescription'>Sprint Description</Label>
          <Textarea
            className='h-32 mt-2'
            name='sprintDescription'
            value={sprintDescription}
            onChange={(e) => setSprintDescription(e.target.value)}
          />
        </div>
        <div className='mt-10'>
          <Label htmlFor='startDate'>Start Date</Label>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {startDate ? (
                    format(startDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className='mt-10'>
          <Label htmlFor='startDate'>End Date</Label>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button className='mt-10' type='submit' disabled={loading}>
          {loading ? 'Loading...' : 'Start'}
        </Button>
      </form>
    </section>
  );
};

export default AddSprintPage;
