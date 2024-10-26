import React from 'react';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section className="about-section pt-[100px] md:pt-16">
      <div className="custom-container sm:!px-0">
        <div className="about-sec-wrapper grid grid-cols-12 gap-6 sm:gap-12 sm:grid-cols-6">
          <div className="about-sec-info-cont sm:px-4 col-span-6 sm:col-span-full">
            <h3 className="h3 about-sec-title max-w-[540px]  mb-5">
              Where Sellers are Donors and Buyers are Givers
            </h3>
            <p className="about-sec-desc">
              Angelpage aims to revolutionise charitable giving through an
              innovative online marketplace. The platform integrates e-commerce
              with charitable donations, allowing users to buy, or donate
              various goods and services.
              <br />
              <br />
              Angelpage aspires to be a significant contributor to charitable
              causes, making every transaction a meaningful act of giving and
              promoting a culture of generosity and social responsibility​​.
            </p>
          </div>
          <div className="about-sec-modal-img col-span-6 sm:col-span-full pl-[54px] laptop-m:pl-0">
            <Image
              src="/images/home/about-sec-modal-img.jpeg"
              className="w-full h-full object-cover"
              alt="about section modal image"
              width={635}
              height={385}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
