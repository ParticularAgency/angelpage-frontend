import React from 'react';
import { Button } from '../elements';
import Image from 'next/image';

const JewelleryProductCtaSec = () => {
  return (
    <section className="jewellery-cta-section overflow-hidden bg-[#F1F1F8]">
      <div className="custom-container">
        <div className="jewellery-cta-wrapper grid grid-cols-12 gap-6 sm:gap-4">
          <div className="jewellery-cont-area py-[55px] col-span-6 sm:col-span-full">
            <h2 className="h3 cta-sec-title max-w-[565px] w-full">
              Get Pre-loved Luxury Jewellery pieces
            </h2>
            <p className="body-small max-w-[383px] w-full mt-[6px] dsc">
              Lorem ipsum dolor sit amet consectetur. Mattis ac a aenean enim
              quam.
            </p>
            <Button
              variant="primary"
              className="mt-6"
              onClick={() => console.log('button on click')}
            >
              Shop jewellery
            </Button>
          </div>
          <div className="jewellery-modelimg-area  col-span-6 sm:col-span-full pt-[35px] sm:pt-0 pl-[29px] lg:pl-0 flex gap-0 items-end">
            <Image
              src="/images/products/jewellery-modal-img1.jpeg"
              className="jewellery-modal-img w-[185px] h-[334px] rounded-tl-[112px] object-cover rounded-tr-[112px]"
              alt="jewellery modal image"
              width={185}
              height={334}
            />
            <Image
              src="/images/products/jewellery-modal-img2.jpeg"
              className="jewellery-modal-img w-[185px] h-[334px] rounded-tl-[112px] object-cover rounded-tr-[112px]"
              alt="jewellery modal image"
              width={185}
              height={334}
            />
            <Image
              src="/images/products/jewellery-modal-img3.jpeg"
              className="jewellery-modal-img w-[185px] h-[334px] rounded-tl-[112px] object-cover rounded-tr-[112px]"
              alt="jewellery modal image"
              width={185}
              height={334}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JewelleryProductCtaSec;
