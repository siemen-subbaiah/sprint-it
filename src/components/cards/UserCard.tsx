import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const UserCard = ({ user }: { user: PrismaUser }) => {
  return (
    <section className='border p-5 rounded-lg'>
      <div className='flex justify-between'>
        <section>
          <h1 className='text-xl'>{user.username}</h1>
          <p>{user.email}</p>
        </section>
        <Avatar>
          <AvatarImage src={user?.photo!} alt={user?.username!} />
          <AvatarFallback>{user?.username?.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </div>
      <p className='mt-2'>{user?.role}</p>
      <p className='mt-2'>
        Status : {user?.isConfirmed ? 'Confirmed' : 'Pending'}
      </p>
    </section>
  );
};

export default UserCard;
