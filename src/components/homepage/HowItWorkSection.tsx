import Image from 'next/image'
import React from 'react'
import { Button } from '../elements'

const HowItWorkSection = () => {
  return (
    <section className='how-it-works-section '>
       <div className="custom-container-full">
        <div className="how-it-works-wrapper grid grid-cols-12 sm:grid-cols-6 gap-[3px]">
           <div className="how-it-works-card-area flex items-start gap-[3px] col-span-6 sm:col-span-full">
                <div className="how-it-work-card-img-modal md:w-[140px] w-full h-[427px]"><Image className='h-full w-full object-cover object-left' src="/images/home/how-it-works-modal-img1.jpeg" alt='how it works sec card modal image' width={358} height={427} /></div>
                <div className="how-it-work-card-cont flex flex-col justify-start h-full bg-mono-100 mb-auto w-full pt-[30px] px-6 pb-[53px]">
                   <p className="eyebrow-small text-mono-0 mb-2">How it works</p>
                   <h4 className="h4 card-title max-w-[220px] w-full mb-4 text-mono-0 font-primary">Where sellers are Donors</h4>
                   <p className="body-small mb-4 text-mono-0 max-w-[290px]">Upload your pre-loved items straight to your chosen Charity storefront, ready for others to purchase.</p>
                   <Button variant='accend-link' className='!text-mono-0 inline-block w-auto max-w-max underline !px-0'>Learn more</Button>
                </div>
           </div>
           <div className="how-it-works-card-area flex items-start gap-[3px] col-span-6 sm:col-span-full">
                <div className="how-it-work-card-cont flex flex-col justify-end h-full bg-mono-100 mt-auto w-full pt-[30px] px-6 pb-[53px]">
                 <p className="eyebrow-small text-mono-0 mb-2">How it works</p>
                 <h4 className="h4 card-title max-w-[220px] w-full mb-4 text-mono-0 font-primary">...and buyers are Givers</h4>
                 <p className="body-small !text-mono-0  max-w-[320px]">AngelPage partners with over 1,200 charities, we give 100% what you spend to a cause of your choice. You only cover the shipping costs.</p>
                </div>
               <div className="how-it-work-card-img-modal md:w-[140px] w-full h-[427px]"><Image className='h-full w-full object-cover' src="/images/home/how-it-works-modal-img2.jpeg" alt='how it works sec card modal image' width={358} height={427} /></div>
           </div>
        </div>
       </div>
    </section>
  )
}

export default HowItWorkSection

