import Image from 'next/image'
import React from 'react'

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
              "A customer testimonial that highlights features and answers
              potential customer doubts about your product or service. Showcase
              testimonials from a similar demographic to your customers."
            </p>
            <div className="reviewer-info flex items-center gap-5 sm:flex-col sm:gap-3 mt-8 sm:mt-6 justify-center">
              <div className="left-cont flex items-center sm:flex-col gap-5 sm:gap-2">
                <div className="reviewer-image w-[56px] h-[56px] sm:w-9 sm:h-9 rounded-full bg-mono-50"></div>
                <div className="info-box">
                  <p className="reviewer-name sm:text-center caption">Name Surname</p>
                  <p className="reviewer-details sm:text-center body-regular sm:body-small">
                    Position, Company name
                  </p>
                </div>
              </div>
              <div className="divider sm:!my-0 h-[61px] sm:h-[2px] sm:w-14 sm:mx-auto w-[2px] bg-mono-50"></div>
              <div className="right-cont max-w-[120px] w-full flex items-center justify-center">
                <Image
                  src="/images/charity/charity-image.png"
                  alt="reviewer image beand logo"
                  width={868}
                  height={1024}
                  className="w-12 h-12 sm:w-10 sm:h-10 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsSection
