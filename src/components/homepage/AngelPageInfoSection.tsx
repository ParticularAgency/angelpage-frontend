'use client';
import Image from 'next/image';
import React from 'react';

const AngelPageInfoSection = () => {
  return (
    <section className="angelpage-info-section py-[100px] md:py-16 overflow-hidden">
      <div className="custom-container sm:!px-0">
        <div className="angelpage-info-sec-wrapper">
          <div className="angelpage-info-title-box sm:px-4 mb-[30px]">
            <h3 className="info-sec-title h3">
              We offer a platform where you can{' '}
              <span className="text-primary-color-100">
                buy, sell, or donate
              </span>{' '}
              a wide variety of goods,{' '}
              <span className="text-primary-color-100">90% of each sale</span>{' '}
              goes to the charity
            </h3>
          </div>
          <div className="angelpage-info-cont-area">
            <div className="inf-sec-group-gallery-img flex items-start flex-nowrap gap-1">
              <Image
                src="/images/home/info-gallery/gallery-img1.png"
                alt="info gallery image"
                width={197}
                height={266}
              />
              <Image
                src="/images/home/info-gallery/gallery-img2.png"
                alt="info gallery image"
                width={197}
                height={266}
              />
              <Image
                src="/images/home/info-gallery/gallery-img3.png"
                alt="info gallery image"
                width={197}
                height={266}
              />
              <Image
                src="/images/home/info-gallery/gallery-img4.png"
                alt="info gallery image"
                width={197}
                height={266}
              />
              <Image
                src="/images/home/info-gallery/gallery-img5.png"
                alt="info gallery image"
                width={197}
                height={266}
              />
              <Image
                src="/images/home/info-gallery/gallery-img6.png"
                alt="info gallery image"
                width={197}
                height={266}
              />
            </div>
            <div className="angelpage-info-cont-wrapper sm:px-4 pt-10 grid grid-cols-12 sm:grid-cols-6 gap-6 sm:gap-8">
              <div className="angelpage-info-left-cont col-span-6 sm:col-span-full">
                <h4 className="h4">Who we are</h4>
                <p className="body-regular mt-[17px] sm:mt-2">
                  AngelPage is a pioneering platform in the e-commerce and
                  charitable giving space. It was created for{' '}
                  <span className="text-primary-color-100">
                    individuals and businesses to support their favourite
                    charities.
                  </span>
                  <br />
                  <br />
                  We are committed to making every transaction on our platform a
                  meaningful act of giving.
                </p>
              </div>
              <div className="angelpage-info-right-cont col-span-6 sm:col-span-full">
                <h4 className="h4">How we can help</h4>
                <p className="body-regular mt-[17px] sm:mt-2">
                  <span className="text-primary-color-100">
                    Charitable Impact:
                  </span>{' '}
                  90% of the sale proceeds go directly to your chosen charity,
                  making supporting causes close to your heart easy.
                  <br />
                  <br />
                  <span className="text-primary-color-100">
                    Support for Businesses:
                  </span>{' '}
                  Brands can fulfil their corporate social responsibility (CSR)
                  commitments by selling new products and excess stock on
                  AngelPage, thereby supporting their favourite charities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AngelPageInfoSection;
