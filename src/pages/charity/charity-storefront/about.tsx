import React from 'react';

const AboutInfoComponent = () => {
  return (
    <div className="storefront-about-tabs-cont pt-[35px] pb-[90px]">
      <div className="custom-container">
        <div className="storefront-about-tabs-cont-wrapper">
          <h4 className="h4 storefront-about mb-[21px] font-primary">
            Salvation Army Trading Co Ltd
          </h4>
          <p className="desc p max-w-[692px] w-full  body-small">
            Our Angelpage shop is bursting with pre-loved items and hidden gems!
            It’s sustainable shopping at your fingertips, that will save you
            money and help transform lives.
            <br />
            <br />
            Profits from our Angelpage shop go to The Salvation Army and the
            important work they do supporting vulnerable people in communities
            across the UK. Our charity helps those experiencing homelessness,
            potential victims of human trafficking, offers support for the
            emergency services at times of crisis and more. Thank you for
            helping us, help others.
          </p>
          <ul className="charity-storefront-info-list mt-[21px] flex flex-col gap-4">
            <li className="charity-storefront-info-item flex items-center gap-2 body-bold-small">
              Charity Number: <span className="body-small">214779</span>
            </li>
            <li className="charity-storefront-info-item flex items-center gap-2 body-bold-small">
              Charity ID: <span className="body-small">340658</span>
            </li>
            <li className="charity-storefront-info-item flex items-center gap-2 body-bold-small">
              Address:{' '}
              <span className="body-small">
                Wellingborough, Northamptonshire, NN8 2QH
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutInfoComponent;
