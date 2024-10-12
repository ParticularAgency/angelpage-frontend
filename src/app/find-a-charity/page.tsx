import CharityList from "@/components/common/cards/charity/charityList";
import SearchBar from "@/components/common/search/globalSearch";
import Image from "next/image";
import React from "react";
import { charityData } from '../../libs/charities';

const FindCharity: React.FC = () => {
  const charityImages = [
    "/images/charity/charity1.png",
    "/images/charity/charity2.png",
    "/images/charity/charity3.png",
    "/images/charity/charity4.png",
    "/images/charity/charity5.png",
    "/images/charity/charity6.png",
  ];
  return (
    <div>
      <div className="custom-container">
        <div className="grid grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4">
          {charityImages.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden shadow-lg max-w-[237px] w-full h-[299px]"
            >
              <Image
                src={image}
                alt={`Charity ${index + 1}`}
                width={238}
                height={299}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pt-[79px] pb-[59px]">
        <h4 className="text-center text-[|#000]">Find a Charity</h4>
        <p className="text-center text-[#0B0112] text-[14px] mt-2 mb-[37px]">
          Search for a charity to support
        </p>
        <div className="px-4">
          <SearchBar />
        </div>
      </div>
      <div className="bg-[#F9F9F9] pt-[95px] pb-[173px] mb-[23px]">
        <div className="custom-container">
          <CharityList charityData={charityData} />
        </div>
      </div>
    </div>
  );
};

export default FindCharity;
