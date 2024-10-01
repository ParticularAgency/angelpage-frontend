import { CloseIcon } from '@/icons'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import GlobalSearchSecondary from '../elements/search/globalSearchSecondary'

const MobileViewOffcanvas = () => {
  return (
     <div className="mobile-view-offcanvas hidden sm:block sm:mr-auto">
               <div className="drawer drawer-start">
                <input id="my-drawer-mobile-menu" type="checkbox" className="drawer-toggle" /> 
                <div className="drawer-content">
                  <label htmlFor="my-drawer-mobile-menu" className="drawer-button btn !bg-transparent !p-0 !border-none"><Image src="/images/header-trigger.svg" alt='header burger icon' width={24} height={24} /></label>
                </div>
                <div className="drawer-side">
                  <label htmlFor="my-drawer-mobile-menu" aria-label="close sidebar" className="drawer-overlay"></label>
                  <div className="menu offcanvas-main-wrapper bg-mono-0 text-base-content min-h-full w-full px-0 pb-8 pt-0">
                    <div className="offcanvas-head flex justify-between items-center pb-5 pt-4 px-4 text-right">
                      <div className="divider w-8"></div>
                      <div className="site-brand-logo flex items-center">
                        <Link href="/"><Image src="/images/brand-logo-black.svg" alt="company brand logo" width={112} height={34} /></Link>
                      </div>
                         <label htmlFor="my-drawer-mobile-menu" aria-label="close sidebar" className="close-btn w-8 h-8 flex items-center justify-center cursor-pointer"><CloseIcon /></label>
                    </div>
                   <div className="offcanvas-main min-h-full">
                      <GlobalSearchSecondary />
                       <div className="menu-canvas-area min-h-full">
                       
                         <div className="megamenu-navigation-box">
                          <ul className="menu bg-transparent p-0 rounded-none">
                            <li>
                              <details>
                                <summary className='!bg-transparent p-0  px-4  py-5 rounded-0 !!text-mono-100 !opacity-100 !text-body-regular !font-normal leading-[150%] font-secondary'>Women</summary>
                                <ul className='!p-0 !m-0'>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Clothing</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Bags</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Accessories</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Jewellery</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                   <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Shoes</summary>
                                      <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                </ul>
                              </details>
                            </li>
                             <li>
                              <details>
                                <summary className='!bg-transparent p-0  px-4  py-5 rounded-0 !!text-mono-100 !opacity-100 !text-body-regular !font-normal leading-[150%] font-secondary'>Men</summary>
                                <ul className='!p-0 !m-0'>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Clothing</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Bags</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Accessories</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Jewellery</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                   <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Shoes</summary>
                                      <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                </ul>
                              </details>
                            </li>
                             <li>
                              <details>
                                <summary className='!bg-transparent p-0  px-4  py-5 rounded-0 !!text-mono-100 !opacity-100 !text-body-regular !font-normal leading-[150%] font-secondary'>Children</summary>
                                <ul className='!p-0 !m-0'>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Clothing</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Bags</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Accessories</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Jewellery</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                   <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Shoes</summary>
                                      <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                </ul>
                              </details>
                            </li>
                             <li>
                              <details>
                                <summary className='!bg-transparent p-0  px-4  py-5 rounded-0 !!text-mono-100 !opacity-100 !text-body-regular !font-normal leading-[150%] font-secondary'>Shoes</summary>
                                <ul className='!p-0 !m-0'>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Clothing</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Bags</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Accessories</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Jewellery</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                   <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Shoes</summary>
                                      <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                </ul>
                              </details>
                            </li>
                             <li>
                              <details>
                                <summary className='!bg-transparent p-0  px-4  py-5 rounded-0 !!text-mono-100 !opacity-100 !text-body-regular !font-normal leading-[150%] font-secondary'>Bags</summary>
                                <ul className='!p-0 !m-0'>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Clothing</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Bags</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Accessories</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Jewellery</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                   <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Shoes</summary>
                                      <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                </ul>
                              </details>
                            </li>
                             <li>
                              <details>
                                <summary className='!bg-transparent p-0  px-4  py-5 rounded-0 !!text-mono-100 !opacity-100 !text-body-regular !font-normal leading-[150%] font-secondary'>Accessories & Jewellery</summary>
                                <ul className='!p-0 !m-0'>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Clothing</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Bags</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Accessories</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Jewellery</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                   <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Shoes</summary>
                                      <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                </ul>
                              </details>
                            </li>
                             <li>
                              <details>
                                <summary className='!bg-transparent p-0  px-4  py-5 rounded-0 !!text-mono-100 !opacity-100 !text-body-regular !font-normal leading-[150%] font-secondary'>Homeware</summary>
                                <ul className='!p-0 !m-0'>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Clothing</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Bags</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Accessories</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                  <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Jewellery</summary>
                                     <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                   <li>
                                    <details>
                                      <summary className='!bg-transparent p-0 pl-8  pr-4 rounded-0 !text-mono-70 py-4 !text-body-eyebrow-small !opacity-100 !font-bold leading-[150%] font-secondary uppercase tracking-[.5px]'>Shoes</summary>
                                      <ul className='!p-0 !m-0 !pt-3 !pb-6 link-lists-item-menu !pl-8  flex flex-col gap-3'>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Skirts
                                        </Link></li>
                                        <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Trousers

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Tops

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Knitwear

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Dresses

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                    Jeans 

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                     Jumpsuits

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                       Coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Leather jackets

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Trench coats

                                        </Link></li>
                                         <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                      Swimwear
                                        </Link></li>
                                                  <li><Link className='!p-0 px-4 font-secondary font-light !text-mono-100 text-left text-body-small leading-[150%] tracking-[.7px]' href="/">
                                        Shorts
                                        </Link></li>
                                      </ul>
                                    </details>
                                  </li>
                                </ul>
                              </details>
                            </li>
                          </ul>
                         </div>
                       </div>
                   </div>
                  </div>
                </div> 
              </div>
             </div>
  )
}

export default MobileViewOffcanvas
