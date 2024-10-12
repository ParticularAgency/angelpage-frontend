/* eslint-disable @typescript-eslint/no-explicit-any */
import { charityData } from "@/libs/charities";
import Image from "next/image";
import Link from "next/link";

const CharityDetailsPage = ({ params }: any) => {
  const charityId = params;

  const charity = charityData.find(
    (charityData) => charityData.id === charityId.charityId
  );
  const imagePath = charity?.image || "/images/default-image.png";
  return (
    <section className="bg-[#F1F1F7]">
      <div className=" flex md:flex-col md:w-full">
        {/* Left Image Section */}
        <div>
          <Image
            src={imagePath}
            alt="Person"
            width={510}
            height={598}
            className="h-full md:w-full object-cover"
          />
        </div>

        {/* Right Text Section */}
        <div className="w-2/3 md:w-full md:p-6 pl-[50px] pt-[121px] pb-[145px]">
          <h3 className="text-[#0B0112] capitalize">{charity?.tag}</h3>
          <p className="text-[10px] text-[#611192] font-semibold">
            CHARITY NUMBER: {charity?.contact.phone}
          </p>
          <p className="mt-4 text-[#0B0112] font-normal text-[14px] w-[651px] sm:w-full">
            {charity?.description}
          </p>
          <div className="mt-6 flex flex-col space-y-2 mb-[45px]">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/charity/call.svg"
                alt="Person"
                width={16}
                height={16}
              />
              <span className="text-[#000]">{charity?.contact.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Image
                src="/images/charity/message.svg"
                alt="Person"
                width={16}
                height={16}
              />
              <a href="https://www.samaritans.org">
                {charity?.contact.website}
              </a>
            </div>
          </div>

          <Link href="/sign-up">
            <button className=" px-4 py-2 bg-[#0B0112] w-[228px] sm:w-auto text-white">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CharityDetailsPage;
