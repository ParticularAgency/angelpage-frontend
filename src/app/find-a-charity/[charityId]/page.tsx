// import { charityData } from '@/libs/charities';
// import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';

// interface CharityProps {
//     charity: {
//         id: string;
//         title: string;
//         tag: string;
//         description: string;
//         image: string;
//         contact: {
//             phone: string;
//             website: string;
//         };
//         charityNumber: string;
//         btnText: string;
//     };
// }

const CharityDetailsPage = () => {
    // console.log('Charity', charity);

    // if (!charity) {
    //     return <div>Charity not found</div>;
    // }

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-6">
            {/* Left Image Section */}
            <div className="relative w-full md:w-1/2 flex justify-center items-center">
                <Image
                    src="/path-to-your-image.jpg" // Replace with the actual image path
                    alt="Person"
                    width={500}
                    height={500}
                    className="rounded-lg object-cover"
                />
                <div className="absolute bottom-6 bg-green-500 text-white text-xl px-6 py-3 font-bold">
                    break the silence
                </div>
            </div>

            {/* Right Text Section */}
            <div className="w-full md:w-1/2 bg-white p-8 md:p-16 shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900">Samaritans</h1>
                <p className="text-sm text-purple-600 font-semibold">CHARITY NUMBER: 000000</p>
                <p className="mt-4 text-gray-600 leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur. Tempus suscipit nisi auctor ut nulla accumsan ut tortor sem. Amet ac
                    dolor varius faucibus in risus. Lorem ipsum dolor sit amet consectetur.
                </p>
                <p className="mt-4 text-gray-600 leading-relaxed">
                    Tempus suscipit nisi auctor ut nulla accumsan ut tortor sem. Amet ac dolor varius faucibus in risus.
                </p>

                <div className="mt-6 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6 text-purple-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 8l7.89 3.11L3 14V8zm0 6l6.31 4.63A1.5 1.5 0 0011 18V6a1.5 1.5 0 00-1.69-1.5L3 8v6z"
                            />
                        </svg>
                        <span className="text-gray-800">116 123</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6 text-purple-600"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2 3h20v4H2V3zm0 7h20v8H2v-8z"
                            />
                        </svg>
                        <a href="https://www.samaritans.org" className="text-purple-600 hover:underline">
                            www.samaritans.org
                        </a>
                    </div>
                </div>

                <button className="mt-8 px-6 py-3 bg-purple-800 text-white rounded-lg hover:bg-purple-700">
                    Sign up
                </button>
            </div>
        </div>
    );
};

export default CharityDetailsPage;

// export const getStaticPaths: GetStaticPaths = async () => {
//     const paths = charityData.map((charity) => ({
//         params: { id: charity.id.toString() }, // Ensure IDs are strings
//     }));
//     console.log(paths); // Check output
//     return {
//         paths,
//         fallback: false,
//     };
// };

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//     const id = params?.id;
//     const charity = charityData.find(charity => charity.id.toString() === id); // Ensure matching is correct
//     if (!charity) {
//         return {
//             notFound: true, // Properly handle not found scenario
//         };
//     }
//     return {
//         props: {
//             charity,
//         },
//     };
// };