'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link'; 
interface Charity {
  charityBannerImage?: string;
  charityName?: string;
  charityNumber?: string;
  description?: string;
  phoneNumber?: string;
  websiteLink?: string;
}
const CharityDetails = () => {
  const params = useParams(); // Retrieve parameters from the route
  const charityid = params?.charityid; // Ensure `charityid` is correctly retrieved
  const [charity, setCharity] = useState<Charity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (charityid) {
      const fetchCharityDetails = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/charity/charities/${charityid}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch charity details');
          }
          const data = await response.json();
          setCharity(data.charity);
          console.log('Charity details:', data.charity);
        } catch (error) {
          console.error('Error fetching charity details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCharityDetails();
    }
  }, [charityid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!charity) {
    return (
      <section className="bg-[#F1F1F7]">
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600">Charity Not Found</h1>
          <p className="mt-2">The charity you're looking for does not exist.</p>
          <Link href="/charity/find-a-charity">
            <button className="mt-4 px-4 py-2 bg-[#0B0112] text-white">
              Back to Charities
            </button>
          </Link>
        </div>
      </section>
    );
  }


  return (
    <section className="bg-[#F1F1F7]">
      <div className="flex md:flex-col md:w-full">
        {/* Left Image Section */}
        <div className="flex-shrink-0">
          <Image
            src={
              charity?.charityBannerImage ||
              '/images/products/card-placeholder-image.webp'
            }
            alt={charity.charityName || 'Charity Image'}
            width={510}
            height={598}
            className="h-full md:w-full object-cover"
          />
        </div>

        {/* Right Text Section */}
        <div className="w-2/3 md:w-full md:p-6 pl-[50px] pt-[121px] pb-[145px]">
          <h3 className="text-[#0B0112] capitalize">{charity.charityName}</h3>
          <p className="text-[10px] text-[#611192] font-semibold">
            CHARITY NUMBER: {charity.charityNumber || 'N/A'}
          </p>
          <p className="mt-4 text-[#0B0112] font-normal text-[14px] w-[651px] sm:w-full">
            {charity.description}
          </p>
          <div className="mt-6 flex flex-col space-y-2 mb-[45px]">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/charity/call.svg"
                alt="Call Icon"
                width={16}
                height={16}
              />
              <span className="text-[#000]">
                {charity.phoneNumber || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Image
                src="/images/charity/message.svg"
                alt="Website Icon"
                width={16}
                height={16}
              />
              {charity.websiteLink ? (
                <a
                  href={charity.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000]"
                >
                  {charity.websiteLink}
                </a>
              ) : (
                <span className="text-[#000]">N/A</span>
              )}
            </div>
          </div>

          <Link href="/auth/register">
            <button className="px-4 py-2 bg-[#0B0112] w-[228px] sm:w-auto text-white">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CharityDetails;
