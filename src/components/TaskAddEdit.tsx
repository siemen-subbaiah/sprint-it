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
import React, { FormEvent, useEffect, useState } from 'react';
import { useToast } from './ui/use-toast';
import {
  CldImage,
  CldUploadWidget,
  CldUploadWidgetResults,
} from 'next-cloudinary';
import { imageFormats } from '@/lib/utils';
import Image from 'next/image';

type Props = {
  isBacklog: boolean;
  users: PrismaUser[];
  sprints?: Sprint[];
  task?: Task;
  params: Params;
  redirectToSprintPage?: boolean;
};

const TaskAddEdit = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const [resources, setResources] = useState<any[] | undefined>([]);
  const [resourcesView, setResourcesView] = useState<any[] | undefined>([]);

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

  useEffect(() => {
    setFormValues({
      itemName: props.task?.itemName!,
      itemDescription: props.task?.itemDescription!,
      assignedUserId: props.task?.assignedUserId!,
      sprintId: props.task?.sprintId ? props.task?.sprintId?.toString()! : '-1',
      status: props.task?.status?.toString()!,
      itemType: props.task?.itemType?.toString()!,
      priority: props.task?.priority?.toString()!,
      estimatedPoints: props.task?.estimatedPoints?.toString()!,
    });
    setResourcesView(props?.task?.attachments!);
    console.log(props?.task);
  }, [props?.task]);

  const handleTaskCreateEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (props?.task) {
      setLoading(true);
      const res = await fetch('/api/edit-task', {
        method: 'POST',
        body: JSON.stringify({
          ...formValues,
          projectId: props.params.projectId,
          id: props.task.id,
          resources,
        }),
      });

      if (res.ok) {
        setLoading(false);
        const data = await res.json();

        if (data.success) {
          router.push(
            `/${props.params.projectId}/${props.params.projectName}/backlog/${props.task.id}`
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
    } else {
      setLoading(true);
      const res = await fetch('/api/save-task', {
        method: 'POST',
        body: JSON.stringify({
          ...formValues,
          projectId: props.params.projectId,
          resources,
        }),
      });

      if (res.ok) {
        setLoading(false);
        const data = await res.json();

        if (data.success) {
          if (props.isBacklog) {
            router.push(
              `/${props.params.projectId}/${props.params.projectName}/backlog`
            );
          } else if (props.redirectToSprintPage) {
            router.push(
              `/${props.params.projectId}/${props.params.projectName}/sprints/${data?.task?.sprintId}`
            );
          } else {
            router.push(
              `/${props.params.projectId}/${props.params.projectName}/board`
            );
          }
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
    }
  };

  return (
    <section>
      <h1 className='text-2xl'>Adding new Task</h1>

      <form className='my-8' onSubmit={handleTaskCreateEdit}>
        <div className='grid grid-cols-1 md:grid-cols-2'>
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
            <div className='mt-10'>
              <Label htmlFor='attachments'>Attachments</Label>
              <div className='mt-2 w-full border border-[#4B4949] rounded-sm p-3 grid grid-cols-1 md:grid-cols-3 gap-4'>
                {resourcesView?.map((resource, i) => {
                  console.log(resource);
                  return (
                    <div key={i} className='mt-2'>
                      {imageFormats.includes(resource.attachmentExtension) && (
                        <CldImage
                          width='200'
                          height='200'
                          src={resource.attachmentPublicId}
                          alt='Uploaded image'
                        />
                      )}
                      {resource.attachmentExtension === 'pdf' && (
                        <Image
                          src='/pdf-logo.svg'
                          alt='landing'
                          width='200'
                          height='200'
                          placeholder='blur'
                          blurDataURL='/pdf-logo.svg'
                        />
                      )}
                      {resource.attachmentExtension === 'doc' && (
                        <Image
                          src='/doc-logo.svg'
                          alt='landing'
                          width='200'
                          height='200'
                          placeholder='blur'
                          blurDataURL='/doc-logo.svg'
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <CldUploadWidget
                signatureEndpoint='/api/sign-cloudinary-params'
                onUpload={(result: any, widget) => {
                  const cloudinaryResult = {
                    attachmentPublicId: result?.info.public_id,
                    attachmentLink: result?.info?.secure_url,
                    attachmentExtension: result?.info?.format,
                  };

                  setResources([...resources!, cloudinaryResult]);
                  if (Array.isArray(resourcesView)) {
                    setResourcesView([...resourcesView!, cloudinaryResult]);
                  } else {
                    setResourcesView([cloudinaryResult]);
                  }

                  console.log(result.info);

                  widget.close();
                }}
              >
                {({ open }) => {
                  function handleOnClick(e: any) {
                    e.preventDefault();
                    open();
                  }
                  return (
                    <div className='mt-2 flex justify-end'>
                      <Button variant='secondary' onClick={handleOnClick}>
                        Upload
                      </Button>
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>
            <Button
              className='hidden md:block mt-10'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Save'}
            </Button>
          </section>
          <section className='md:ml-10 mt-10 md:mt-0'>
            <div>
              <Label htmlFor='assignUser'>Assign users</Label>
              <Select
                defaultValue={props?.task?.assignedUserId}
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
            <div className='mt-10'>
              <Label htmlFor='addTo'>Add to</Label>
              <Select
                defaultValue={
                  props?.task?.sprintId ? props?.task?.sprintId : '-1'
                }
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
                    {props.isBacklog && (
                      <SelectItem value='-1'>Backlog</SelectItem>
                    )}
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
            <div className='mt-10'>
              <Label htmlFor='status'>Status</Label>
              <Select
                defaultValue={props?.task?.status.toString()}
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
                defaultValue={props?.task?.itemType.toString()}
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
                defaultValue={props?.task?.priority.toString()}
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
                defaultValue={props?.task?.estimatedPoints.toString()}
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
            <Button
              className='md:hidden block mt-10'
              type='submit'
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Save'}
            </Button>
          </section>
        </div>
      </form>
    </section>
  );
};

export default TaskAddEdit;
