import React from 'react'
import Image from "next/image";
const AboutSection = () => {
  return (
         <section className="about-section w-full bg-[#F1F1F7] flex sm:flex-col gap-[72px] md:gap-12 mt-20 sm:mt-10"> 
        <div className="relative sm:w-full w-2/5">
          {/* Background Image */}
          <Image
            width={530}
            height={450}
            src="/images/how-it-works/willson.png"
            alt="Dr. Wilson Ndasi"
            className="w-full h-full object-cover"
          />
          {/* Text Overlay */}
          <div className="absolute inset-0  flex items-end">
            <div className="text-white pl-[55px] pb-[33px] sm:px-[27px] sm:py-[18px] max-w-lg">
              <h3 className="text-[18px] mb-3 font-bold ml-[7px]">
                Dr. Wilson Ndasi
              </h3>
              <p className="text-white mb-2">
                PhD in Management (Digital Marketing)
              </p>
              <p className="text-white">Bournemouth University</p>
            </div>
          </div>
        </div>

        {/* Text on the right side */}
        <div className="w-3/5 sm:w-full py-12 pr-10 sm:p-4 flex items-center">
          <div className="text-left">
            <h6 className="uppercase text-[10px] font-bold">The Founder</h6>
            <p className="text-[18px] mt-4 mb-[110px] md:mb-12 sm:mb-8 max-w-[758px] w-full">
              Dr. Ndasi has contributed extensively to academia and practical
              applications in digital marketing and non-profit initiatives. His
              research focuses on cause-related marketing and the strategic use
              of digital methods to promote environmental stewardship and
              support the circular economy.
            </p>
            <p className="text-[14px]">Dr. Wilson Ndasi</p>
            <Image
              width={208}
              height={95}
              src="/images/how-it-works/signature.svg"
              alt="Dr. Wilson Ndasi's signature"
              className="mt-[7px]"
            />
          </div>
        </div>
      </section>
  )
}

export default AboutSection
