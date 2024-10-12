import Link from 'next/link'
import React from 'react'

const TopNavList = () => {
  return (
    <ul className="top-nav-list mr-auto sm:hidden flex items-center gap-4 justify-between max-w-[349px] w-full">
                <li className="top-nav-item"><Link className='text-mono-90 text-body-eyebrow-small font-medium leading-[150%] uppercase tracking-[.5px] font-secondary' href="/how-it-works">How it works</Link></li>
                <li className="top-nav-item"><Link className='text-mono-90 text-body-eyebrow-small font-medium leading-[150%] uppercase tracking-[.5px] font-secondary' href="/find-a-charity">Find a Charity</Link></li>
                <li className="top-nav-item"><Link className='text-mono-90 text-body-eyebrow-small font-medium leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Contact Us</Link></li>
               </ul>
  )
}

export default TopNavList
