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
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { imageFormats } from '@/lib/utils';
import Image from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';

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
    itemDescription: props?.task?.itemDescription
      ? props?.task?.itemDescription
      : '',
    assignedUserId: '',
    sprintId: props?.isBacklog ? '-1' : '',
    status: '',
    itemType: '',
    priority: '',
    estimatedPoints: '',
  });

  const editor = useEditor({
    extensions: [StarterKit.configure({})],
    content: formValues.itemDescription,
    editorProps: {
      attributes: {
        class: 'rounded-md border min-h-[150px]',
      },
    },
    onUpdate({ editor }) {
      setFormValues({
        ...formValues,
        itemDescription: editor.getHTML(),
      });
      console.log(editor.getHTML());
    },
  });

  useEffect(() => {
    if (props?.task) {
      setFormValues({
        itemName: props.task?.itemName!,
        itemDescription: props.task?.itemDescription!,
        assignedUserId: props.task?.assignedUserId!,
        sprintId: props.task?.sprintId
          ? props.task?.sprintId?.toString()!
          : '-1',
        status: props.task?.status?.toString()!,
        itemType: props.task?.itemType?.toString()!,
        priority: props.task?.priority?.toString()!,
        estimatedPoints: props.task?.estimatedPoints?.toString()!,
      });
      setResourcesView(props?.task?.attachments!);
      console.log(props?.task);
    }
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
          if (props.isBacklog) {
            router.push(
              `/${props.params.projectId}/${props.params.projectName}/backlog`
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

  const handleDeleteAsset = async (resource: any) => {
    const res = await fetch('/api/delete-asset', {
      method: 'POST',
      body: JSON.stringify({
        public_id: resource.attachmentPublicId,
        id: resource.id,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        if (data.attachments) {
          const deletedAttachmentId = data.attachments.id;
          const updatedResources = resourcesView?.filter(
            (item) => item.id !== deletedAttachmentId
          );
          setResourcesView(updatedResources);
        } else {
          const deletedAttachmentId = data.attachmentPublicId;
          const updatedResourcesView = resourcesView?.filter(
            (item) => item.attachmentPublicId !== deletedAttachmentId
          );
          const updatedResources = resources?.filter(
            (item) => item.attachmentPublicId !== deletedAttachmentId
          );
          setResourcesView(updatedResourcesView);
          setResources(updatedResources);
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
              {/* <Textarea
                className='h-32 mt-2'
                name='taskDescription'
                value={formValues.itemDescription}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    itemDescription: e.target.value,
                  })
                }
              /> */}
              <div className='mt-2'>
                <Toolbar editor={editor} />
              </div>
              <div className='mt-2'>
                <EditorContent editor={editor} />
              </div>
            </div>
            <div className='mt-10'>
              <Label htmlFor='attachments'>Attachments</Label>
              <div className='mt-2 w-full border border-[#4B4949] rounded-sm p-3 grid grid-cols-1 md:grid-cols-3 gap-4'>
                {resourcesView?.map((resource, i) => {
                  return (
                    <div key={i} className='mt-2'>
                      {imageFormats.includes(resource.attachmentExtension) && (
                        <div className='flex gap-2'>
                          <CldImage
                            width='200'
                            height='200'
                            src={resource.attachmentPublicId}
                            alt='Uploaded image'
                          />
                          <CrossCircledIcon
                            className='h-6 w-6 cursor-pointer'
                            onClick={() => handleDeleteAsset(resource)}
                          />
                        </div>
                      )}
                      {resource.attachmentExtension === 'pdf' && (
                        <div className='flex gap-2'>
                          <Image
                            src='/pdf-logo.svg'
                            alt='landing'
                            width='200'
                            height='200'
                            placeholder='blur'
                            blurDataURL='/pdf-logo.svg'
                          />
                          <CrossCircledIcon
                            className='h-6 w-6 cursor-pointer'
                            onClick={() => handleDeleteAsset(resource)}
                          />
                        </div>
                      )}
                      {resource.attachmentExtension === 'doc' && (
                        <div className='flex gap-2'>
                          <Image
                            src='/doc-logo.svg'
                            alt='landing'
                            width='200'
                            height='200'
                            placeholder='blur'
                            blurDataURL='/doc-logo.svg'
                          />
                          <CrossCircledIcon
                            className='h-6 w-6 cursor-pointer'
                            onClick={() => handleDeleteAsset(resource)}
                          />
                        </div>
                      )}
                      {resource.attachmentExtension === 'txt' && (
                        <div className='flex gap-2'>
                          <Image
                            src='/txt-logo.svg'
                            alt='landing'
                            width='200'
                            height='200'
                            placeholder='blur'
                            blurDataURL='/txt-logo.svg'
                          />
                          <CrossCircledIcon
                            className='h-6 w-6 cursor-pointer'
                            onClick={() => handleDeleteAsset(resource)}
                          />
                        </div>
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
                    attachmentExtension: result?.info?.format
                      ? result?.info?.format
                      : result?.info?.public_id.split('.')[1],
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
                required
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
                required={props?.isBacklog ? false : true}
                defaultValue={
                  props?.task?.sprintId
                    ? props?.task?.sprintId.toString()
                    : '-1'
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
                required
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
                required
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
                required
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
                required
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
