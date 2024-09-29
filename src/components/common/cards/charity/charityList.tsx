/* eslint-disable @typescript-eslint/no-explicit-any */
import { charityData } from '@/libs/charities';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const CharityList: React.FC = () => {

    return (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 grid-cols-3 gap-8">
            {charityData.map((charity: any) => (
                <div className="w-[358px] overflow-hidden relative" key={charity.id}>
                    <div className="relative w-full h-48">
                        <span className='absolute top-2 left-2 z-10 uppercase text-[#611192] bg-[#F2E8F8] p-2 text-center text-[10px] font-bold'>{charity.tag}</span>
                        <Image src={charity.image} alt={charity.title} width={358} height={197} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-[10px] uppercase text-[#611192] mt-4 mb-3">{charity.title}</p>
                        <p className="text-[#474648] text-[14px]">{charity.description}</p>
                        <Link href={`/find-a-charity/${charity.id}`} passHref>
                            <button className="mt-4 bg-[#0B0112] text-white py-2 px-4 w-full text-[14px]">
                                Donate
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CharityList;