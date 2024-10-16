import React from 'react';
import { charityData } from '@/libs/homeCharityList'; // Ensure this is updated with 'name'
import CharityList from "@/components/common/cards/charity/charityList";

const CharitySection = () => {
  return (
    <section className='Charity-section pt-[75px] pb-20'>
      <div className="custom-container">
        <div className="section-title-box mb-10">
            <h3 className="h3 section-title font-primary text-mono-100">Great Causes to Support</h3>
        </div>
        <div className="charity-section-wrapper">
            <CharityList charityData={charityData} />
        </div>
      </div>
    </section>
  )
}

export default CharitySection;

