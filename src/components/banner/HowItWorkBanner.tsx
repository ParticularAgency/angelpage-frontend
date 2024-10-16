import React from 'react'
import Image from "next/image";
const HowItWorkBanner = () => {
  return (
     <section className="how-it-work-banner  w-full bg-white">
        <div className="grid grid-cols-2">
          {/* Left Side: Grid of Images */}
          <div className="grid grid-rows-2 h-full grid-cols-2">
            {/* Top-left image */}
            <div className="h-full">
              <Image
                width={339}
                height={310}
                alt="Logo"
                src="/images/how-it-works/logo.svg"
                className="w-full max-h-[310px] h-full object-cover"
              />
            </div>

            {/* Bottom-right image */}
            <div className="h-full">
              <Image
                width={339}
                height={310}
                src="/images/how-it-works/img2.png"
                alt="Helping people"
                className="w-full max-h-[310px] h-full object-cover"
              />
            </div>
            <div className="col-span-2 h-full">
              <Image
                width={710}
                height={310}
                src="/images/how-it-works/img3.png"
                alt="Dogs in cages"
                className="w-full max-h-[310px] h-full object-cover"
              />
            </div>
          </div>
          {/* Right Side: Logo and Text */}
          <Image
            width={730}
            height={620}
            src="/images/how-it-works/img4.png"
            alt="Children playing with water"
            className="w-full max-h-[620px] h-full object-cover"
          />
        </div>
      </section>
  )
}

export default HowItWorkBanner
