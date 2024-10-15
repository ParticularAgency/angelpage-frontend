import Image from "next/image";
import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <>
      <section className="w-full bg-white pt-[18px]">
        <div className="grid grid-cols-2">
          {/* Left Side: Grid of Images */}
          <div className="grid grid-rows-2 grid-cols-2">
            {/* Top-left image */}
            <div>
              <Image
                width={339}
                height={310}
                alt="Logo"
                src="/images/how-it-works/logo.svg"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom-right image */}
            <div>
              <Image
                width={339}
                height={310}
                src="/images/how-it-works/img2.png"
                alt="Helping people"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2">
              <Image
                width={710}
                height={310}
                src="/images/how-it-works/img3.png"
                alt="Dogs in cages"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Right Side: Logo and Text */}
          <Image
            width={730}
            height={620}
            src="/images/how-it-works/img4.png"
            alt="Children playing with water"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      {/* Section 2 - Full-width */}
      <section className="w-full bg-[#F1F1F7] flex gap-[72px] mt-32">
        <div className="relative w-2/5">
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
            <div className="text-white ml-[55px] mb-[33px] max-w-lg">
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
        <div className="w-3/5 flex items-center">
          <div className="text-left">
            <h6 className="uppercase text-[10px] font-bold">The Founder</h6>
            <p className="text-[18px] mt-4 mb-[110px]">
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
    </>
  );
};

export default HowItWorks;
