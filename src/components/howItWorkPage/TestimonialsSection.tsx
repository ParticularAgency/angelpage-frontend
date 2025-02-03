import Image from 'next/image';
import React from 'react';

const TestimonialsSection = () => {
  return (
    <div className="customer-testimonials-section py-[112px] sm:py-16">
      <div className="custom-container">
        <div className="customer-testimonials-wrapper">
          <div className="testimonials-item">
            <ul className="reviews-stars flex items-center gap-1 max-w-[118px] w-full mx-auto mb-8">
              <li className="star">
                <Image
                  src="/images/icons/stars.svg"
                  alt="stars item"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </li>
              <li className="star">
                <Image
                  src="/images/icons/stars.svg"
                  alt="stars item"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </li>
              <li className="star">
                <Image
                  src="/images/icons/stars.svg"
                  alt="stars item"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </li>
              <li className="star">
                <Image
                  src="/images/icons/stars.svg"
                  alt="stars item"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </li>
              <li className="star">
                <Image
                  src="/images/icons/stars.svg"
                  alt="stars item"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </li>
            </ul>
            <p className="body-large sm:body-medium desc review-text text-center max-w-[768px] w-full mx-auto">
              "It's a win-win—decluttering my home while supporting
              sustainability and charity at the same time. Highly recommend for
              anyone looking to make a difference in a meaningful way"
            </p>
            <div className="reviewer-info flex items-center gap-5 sm:flex-col sm:gap-3 mt-8 sm:mt-6 justify-center">
              <div className="left-cont flex items-center sm:flex-col gap-5 sm:gap-2">
                <div className="reviewer-image flex items-center overflow-hidden justify-center w-14 h-14 rounded-full bg-mono-50">
                  <Image
                    src="/images/pexels-karolina-grabowska.jpg"
                    alt="reviewer image beand logo"
                    width={6720}
                    height={4480}
                    className="max-w-[120px] max-h-[120px] h-full mx-auto sm:w-9 sm:h-9"
                  />
                </div>
                <div className="info-box">
                  <p className="reviewer-name sm:text-center caption">
                    Jenny Baker
                  </p>
                  <p className="reviewer-details sm:text-center body-regular sm:body-small">
                    Mother of 3
                  </p>
                </div>
              </div>
              {/* <div className="divider sm:!my-0 h-[61px] sm:h-[2px] sm:w-14 sm:mx-auto w-[2px] bg-mono-50"></div>
              <div className="right-cont max-w-[120px] w-full flex items-center justify-center">
                
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
