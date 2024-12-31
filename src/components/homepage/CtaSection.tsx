'use client';
import React from 'react';
import { Button } from '../elements';
import Image from 'next/image';
import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="cta-section pb-[60px] laptop-x:pb-0 laptop-x:h-[533px] md:!p-0 md:h-auto">
      <div className="cta-sec-wrapper pt-[60px] md:pt-12 h-full">
        <div className="custom-container-fluid md:!px-0 h-full">
          <div className="cta-sec-cont-area  grid grid-cols-12 gap-0 sm:grid-cols-6 h-full !pl-20 !pr-[60px] laptop-m:!px-12 md:!px-0">
            <div className="cta-sec-left-cont-wrap  md:h-[490px] sm:h-[320px] col-span-3 md:col-span-full  laptop-x:col-span-7 sm:col-span-full">
              <div className="cta-section-left-cont md:px-5 md:h-full">
                <h2 className="h2 cta-title font-primary max-w-[341px] sm:max-w-[282px] w-full mb-4">
                  Giving has never been easier
                </h2>
                <p className="body-regular sm:max-w-[205px] !font-light">
                  Start donating to a Charity today!
                </p>
              </div>
            </div>
            <div className="col-span-4 laptop-x:hidden">
              <Image
                src="/images/home/cta-sec-modal-bg-img.png"
                alt="cta section modal img"
                width={339}
                height={320}
              />
            </div>
            <div className="cta-section-right-cont md:py-[60px] sm:py-12 md:px-6 pl-[66px] laptop-m:pl-0 col-span-5  md:col-span-full">
              <h3 className="h3 cta-title max-w-[460px] w-full mb-4">
                Transform Your Transactions into Acts of Kindness
              </h3>
              <p className="body-regular max-w-[465px] !font-light">
                Welcome to AngelPage, where commerce meets compassion.
                <br />
                <br />
                Our mission is to revolutionise charitable giving by seamlessly
                integrating it into everyday transactions. At AngelPage, every
                purchase and sale can contribute to the greater good.
              </p>
              <div className="cta-sec-btn-box flex mt-10 items-center gap-[7px]">
                <Link href="/auth/register">
                  <Button variant="primary">Start selling for free</Button>
                </Link>
                <Link href="/product">
                  <Button variant="accend-link" className="!underline">
                    Browse items
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
