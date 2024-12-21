'use client';
import React from 'react';
import HomeLanding from './home-landing/HomeLanding';
import InternalHome from './internal-home/InternalHome';
import { useSession} from 'next-auth/react';
const HomePage = () => {
   const { data: session } = useSession() || {};
  return (
    <>
      {session ? (
        <>
          {/* <h1>{session?.user?.id}Welcome, {session.user.name}!</h1>
          <p>Email: {session.user.email}</p>
          <p>Email: {session.user.role}</p>
          <button onClick={() => signOut()}>Logout</button> */}
          <InternalHome />
        </>
      ) : (
        <HomeLanding /> 
      )}
      
    </>
  );
};

export default HomePage;
