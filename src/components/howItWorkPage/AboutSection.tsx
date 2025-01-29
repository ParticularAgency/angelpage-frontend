'use client';
import React from 'react';
// import Image from 'next/image';
const AboutSection = () => {
  return (
    <section className="about-section w-full bg-mono-0 py-20 sm:py-16">
      <div className="custom-container">
        <div className="about-sec-wrapper grid grid-cols-12 sm:flex sm:flex-col-reverse gap-20 sm:gap-12">
          <div className="about-sec-left-con flex flex-col justify-center col-span-6">
            <h5 className="eyebrow-medium mb-4 font-secondary">Who are we</h5>
            <h2 className="h3 title font-primary">About Angel Page</h2>
            <p className="desc body-regular max-w-[600px] mt-4 w-full font-secondary whitespace-pre-wrap">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              varius faucibus massa sollicitudin amet augue. Nibh metus a semper
              purus mauris duis. Lorem eu neque, tristique quis duis. Nibh
              scelerisque ac adipiscing velit non nulla in amet pellentesque.
              Sit turpis pretium eget maecenas. Vestibulum dolor mattis
              consectetur eget commodo vitae. Amet pellentesque sit pulvinar
              lorem mi a, euismod risus rhoncus. Elementum ullamcorper nec,
              habitasse vulputate. Eget dictum quis est sed egestas tellus, a
              lectus. Quam ullamcorper in fringilla arcu aliquet fames
              arcu.Lacinia eget faucibus urna, nam risus nec elementum cras
              porta. Sed elementum, sed dolor purus dolor dui. Ut dictum nulla
              pulvinar vulputate sit sagittis in eleifend dignissim. Natoque
              mauris cras molestie velit. Maecenas eget adipiscing quisque
              viverra lectus arcu, tincidunt ultrices pellentesque.
            </p>
          </div>
          <div className="about-sec-right-cont col-span-6 h-[640px] sm:h-[280px] bg-mono-40 w-full"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
