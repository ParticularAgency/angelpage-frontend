"use client"
import React,{useState} from 'react'
import HomeLanding from './home-landing/HomeLanding';
import InternalHome from './internal-home/InternalHome';
const HomePage = () => {
      const [isLoggedIn, setIsLoggedIn] = useState(true);
       const toggleLogin = () => {
    setIsLoggedIn(prevState => !prevState);
  };
  return (
    <>
       {isLoggedIn ? (
      <InternalHome />
      ) : (
       <HomeLanding />
      )}
        <button onClick={toggleLogin}>
        {isLoggedIn ? '' : ''}
      </button>
    </>
  )
}

export default HomePage
