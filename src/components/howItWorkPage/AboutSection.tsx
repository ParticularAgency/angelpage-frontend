'use client';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

const AboutSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handles Play/Pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Syncs State with Native Controls
  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  return (
    <section className="about-section w-full bg-mono-0 py-20 sm:py-16">
      <div className="custom-container">
        <div className="about-sec-wrapper grid grid-cols-12 sm:flex sm:flex-col-reverse gap-20 sm:gap-12">
          <div className="about-sec-left-con flex flex-col justify-center col-span-6">
            <h5 className="eyebrow-medium mb-4 font-secondary">Who are we</h5>
            <h2 className="h3 title font-primary">About Angel Page</h2>
            <p className="desc body-regular max-w-[600px] mt-4 w-full font-secondary whitespace-pre-wrap">
              AngelPage is reshaping the landscape of charitable giving by
              leveraging the power of digital commerce. We provide a dedicated
              platform where individuals can sell pre-loved items, with the
              proceeds directly supporting their chosen charities, including
              local charity shops.
              <br />
              <br />
              Driven by a commitment to sustainability and philanthropy,
              AngelPage makes it effortless for anyone to contribute to
              charitable causes through their everyday transactions. Our
              platform ensures that supporting charities and enhancing the
              operations of charity shops is accessible and impactful. AngelPage
              stands out by ensuring that every transaction directly benefits
              charity. We focus on simplicity and efficiency, making it easy for
              everyone to make a difference while contributing a portion of
              proceeds to sustain and expand our mission. Be part of a movement
              that transforms clutter into charity and shopping into support for
              worthy causes. Sign up today and make a difference with each item
              you sell or purchase on AngelPage, completing the mission of
              charity shops across the region.
            </p>
          </div>

          {/* Video Section */}
          <div className="about-sec-right-cont rounded-[4px] my-auto col-span-6 h-[360px] sm:h-[280px] bg-mono-40 w-full flex items-center justify-center relative">
            <video
              ref={videoRef}
              className="w-full h-full object-cover cursor-pointer rounded-lg"
              src="/images/video/angelpage-new.mp4"
              poster="/images/video/overlyn-image.png"
              controls
              playsInline
              disablePictureInPicture
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
            />

            {!isPlaying && (
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg"
              >
                <Image
                  src="/images/video/play-button-svgrepo-com.svg"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain"
                  alt="video play button"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
