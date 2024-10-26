import React from 'react';
import { Button } from '../elements';
import Image from 'next/image';

const IntHomeCtaSec = () => {
  return (
    <section className="inthome-cta=section bg-mono-100">
      <div className="custom-container-full laptop-x:px-6 !pr-0 sm:!px-0">
        <div className="inthome-cta-wrapper grid grid-cols-12 gap-0 sm:grid-cols-6">
          <div className="inthome-cta-cont-box px-4 col-span-5 sm:col-span-full py-[50px] pr-[60px] md:py-8">
            <div className="inthome-cta-cont max-w-[410px] w-full ml-auto">
              <h2 className="h3 cta-title text-mono-0  max-w-[348px] w-full">
                Out with Old, in with the New
              </h2>
              <p className="desc mt-[6px] text-mono-0 max-w-[383px] w-full body-small">
                Lorem ipsum dolor sit amet consectetur. Mattis ac a aenean enim
                quam.
              </p>
              <Button
                variant="secondary"
                className="!text-mono-0 !border-mono-0 mt-8"
              >
                Shop now
              </Button>
            </div>
          </div>
          <div className="inthome-cta-modal-area w-full col-span-7 sm:col-span-full h-[387px]">
            <Image
              src="/images/inthome-cta-modal-img.jpeg"
              alt="internal home cta model image"
              className="w-full h-full object-cover"
              width={831}
              height={387}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntHomeCtaSec;
