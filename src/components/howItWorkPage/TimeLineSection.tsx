import React from 'react'

const TimeLineSection = () => {
  return (
      <section className="timeline-section bg-white pt-16 pb-6">
        <div className="custom-container">
        <div className="text-center mb-20">
          <h2 className="text-mono-100 h3 mb-[14px]">
            AngelPage Timeline
          </h2>
          <p className="body-regular">
            Transforming everyday transactions into opportunities for charitable
            giving since 2022, making it easy for individuals and businesses to
            support causes they care about.
          </p>
        </div>
       </div>
        <div className="relative timeline-main-area">
          <div className="custom-container-fluid lg:px-6 sm:px-0">
          <div className="grid sm:grid-cols-1 grid-cols-3 gap-16 lg:gap-7 relative z-10">
            <div className='timeline-card-item flex flex-col justify-between  items-center w-full'> 
              <div className="timeline-card-cont-wrap sm:w-full pb-[300px] sm:pb-[170px]"> 
              <div className="timeline-card-cont max-w-[314px] sm:mx-auto h-[124px] w-full bg-secondary-color-100 text-white p-4 rounded-lg shadow-lg">
                <h6 className="caption text-[#C9C8CA]">
                  Conceptualization
                </h6>
                <p className="mt-2 body-small text-mono-0">
                  The idea of AngelPage was born from Dr. Ndasi’s previous
                  venture,
                  <a
                    href="https://charitysupermarkets.com"
                    className="underline text-[#611192]"
                  >
                    {" "}
                    Charitysupermarkets.com
                  </a>
                </p>
              </div>
              </div>
              <div className="flex flex-col items-center mt-6 sm:mt-3"> 
                <p className="text-body-large md:text-body-regular font-normal text-center font-primary leading-[135%] tracking-[.2px] text-[#000]">2022</p>
              </div>
            </div>

            <div  className='timeline-card-item flex flex-col justify-between  items-center w-full'>
              <div className="timeline-card-cont-wrap sm:w-full pb-[300px] sm:pb-[170px]">
              <div className="timeline-card-cont max-w-[314px] sm:mx-auto relative bottom-[-58px] sm:bottom-0 h-[124px] w-full bg-secondary-color-100 text-white p-4 rounded-lg shadow-lg">
                <h6 className="caption text-[#C9C8CA]">
                  Development
                </h6>
                <p className="mt-2 body-small text-mono-0">
                  The design and development of AngelPage begins!
                </p>
              </div>
              </div>
              <div className="flex flex-col items-center mt-6 sm:mt-3"> 
                <p className="text-body-large md:text-body-regular font-normal text-center font-primary leading-[135%] tracking-[.2px] text-[#000]">2024</p>
              </div>
            </div>

            <div className='timeline-card-item flex flex-col justify-between  items-center w-full'>
              <div className="timeline-card-cont-wrap sm:w-full pb-[300px] sm:pb-[170px]">  
              <div className="timeline-card-cont max-w-[314px] sm:mx-auto relative bottom-[-33px] sm:bottom-0 h-[124px] w-full bg-secondary-color-100 text-white p-4 rounded-lg shadow-lg">
                <h6 className="caption text-[#C9C8CA]">Launch</h6>
                <p className="mt-2 body-small text-mono-0">
                  AngelPage goes public, a global community where every
                  transaction positively impacts society.
                </p>
              </div>
              </div>
              <div className="flex flex-col items-center mt-6 sm:mt-3"> 
                <p className="text-body-large md:text-body-regular font-normal text-center font-primary leading-[135%] tracking-[.2px] text-[#000]">2025</p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
  )
}

export default TimeLineSection
