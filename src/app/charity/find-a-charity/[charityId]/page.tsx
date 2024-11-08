import { charityData } from '@/libs/charities'; // Import charity data
import Image from 'next/image'; // Import Next.js Image component
import Link from 'next/link'; // Corrected import path for Link component

// Define types for charity contact and charity data
interface CharityContact {
  phone?: string; // Phone number of the charity
  website?: string; // Website of the charity
}

interface Charity {
  id: string; // Unique identifier for the charity
  name: string; // Name of the charity
  charityNumber: string;
  description: string; // Description of the charity
  image?: string; // Image URL of the charity
  contact: CharityContact; // Contact information for the charity
}

// Define type for the params passed to the page
interface Params {
  charityId: string; // The ID of the charity from the URL
}

// Page component
const CharityDetailsPage = ({ params }: { params: Params }) => {
  const { charityId } = params;

  // Find the charity data by ID
  const charity = charityData.find(
    (charity: Charity) => charity.id === charityId
  );

  // Fallback image if charity image is not available
  const imagePath = charity?.image || '/images/default-image.png';

  // Return an error message if the charity is not found
  if (!charity) {
    return (
      <section className="bg-[#F1F1F7]">
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600">Charity Not Found</h1>
          <p className="mt-2">The charity you're looking for does not exist.</p>
          <Link href="/charities">
            <button className="mt-4 px-4 py-2 bg-[#0B0112] text-white">
              Back to Charities
            </button>
          </Link>
        </div>
      </section>
    );
  }

  // Render the charity details
  return (
    <section className="bg-[#F1F1F7]">
      <div className="flex md:flex-col md:w-full">
        {/* Left Image Section */}
        <div className="flex-shrink-0">
          <Image
            src={imagePath}
            alt={charity.name || 'Charity Image'}
            width={510}
            height={598}
            className="h-full md:w-full object-cover"
          />
        </div>

        {/* Right Text Section */}
        <div className="w-2/3 md:w-full md:p-6 pl-[50px] pt-[121px] pb-[145px]">
          <h3 className="text-[#0B0112] capitalize">{charity.name}</h3>
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
                {charity.contact?.phone || 'N/A'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Image
                src="/images/charity/message.svg"
                alt="Website Icon"
                width={16}
                height={16}
              />
              {charity.contact?.website ? (
                <a
                  href={charity.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#000]"
                >
                  {charity.contact.website}
                </a>
              ) : (
                <span className="text-[#000]">N/A</span>
              )}
            </div>
          </div>

          <Link href="/sign-up">
            <button className="px-4 py-2 bg-[#0B0112] w-[228px] sm:w-auto text-white">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CharityDetailsPage;
