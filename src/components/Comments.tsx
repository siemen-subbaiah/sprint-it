'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { commentToServer, deleteComment } from '@/actions/comment';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogPortal,
} from '@/components/ui/alert-dialog';
import SubmitButton from './submit/SubmitButton';

const Comments = ({
  taskId,
  comments,
  params,
  userId,
}: {
  taskId: number;
  comments: Comment[];
  params: Params;
  userId: string;
}) => {
  const [comment, setComment] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [commentId, setCommentId] = useState(0);
  const [open, setOpen] = useState(false);

  const handleCommenting = () => {
    commentToServer(params, comment, taskId, isEdit, commentId);
    setComment('');
    setIsEdit(false);
  };

  const handleEditComment = (oldComment: string, commentId: number) => {
    setComment(oldComment);
    setCommentId(commentId);
    setIsEdit(true);
  };

  const handleDeleteComment = (commentId: number) => {
    deleteComment(commentId, params);
    setOpen(false);
  };

  return (
    <>
      <section className='mt-5'>
        {comments?.map((item) => {
          return (
            <div key={item.id} className='mt-6'>
              <section className='flex gap-4 items-center'>
                <Avatar>
                  <AvatarImage
                    src={item?.createdUserPic!}
                    alt={item?.createdUserName}
                  />
                  <AvatarFallback>
                    {item?.createdUserName?.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <h1 className='text-xl'>{item?.createdUserName}</h1>
              </section>
              <div className='flex gap-2 items-baseline'>
                <p className='mt-3'>{item?.comment}</p>
                {item.createdUserId === userId && (
                  <div className='flex gap-2'>
                    <Pencil2Icon
                      className='h-4 w-4 cursor-pointer'
                      onClick={() => handleEditComment(item?.comment, item?.id)}
                    />
                    <AlertDialog open={open} onOpenChange={setOpen}>
                      <AlertDialogTrigger asChild>
                        <TrashIcon className='h-4 w-4 cursor-pointer' />
                      </AlertDialogTrigger>
                      <AlertDialogPortal>
                        <AlertDialogOverlay />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the comment.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <form action={() => handleDeleteComment(item?.id)}>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <Button type='submit'>Delete</Button>
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                      </AlertDialogPortal>
                    </AlertDialog>
                  </div>
                )}
              </div>
              <p className='mt-2 text-sm text-[#4B4949]'>
                {new Date(item?.updatedAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </section>

      <form className='mt-5' action={handleCommenting}>
        <Input
          required
          name='comment'
          placeholder='Enter your comment here'
          className='mt-2 md:w-2/6'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <section className='mt-5'>
          <SubmitButton title='Comment' />
        </section>
      </form>
    </>
  );
};

export default Comments;
