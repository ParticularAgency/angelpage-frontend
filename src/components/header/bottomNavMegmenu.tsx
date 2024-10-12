import Link from 'next/link'
import React from 'react'

const BottomNavMegmenu = () => {
  return (
       <nav className="header-bottom-navbar navbar-megamenu-area">
          <ul className="navbar-nav-list flex items-center flex-wrap gap-10">
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Women</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Men</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Children</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Shoes</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Bags</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Accessories & Jewellery</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Homeware</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Books</Link></li>
             <li className="navbar-nav-items"><Link className='text-mono-90 text-body-eyebrow-small font-normal leading-[150%] uppercase tracking-[.5px] font-secondary' href="/">Electronics</Link></li>
          </ul>
        </nav>
  )
}

export default BottomNavMegmenu
