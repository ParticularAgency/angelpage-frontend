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
        <section className='bg-[#F1F1F7]'>
            <div className=" flex md:flex-col">
                {/* Left Image Section */}
                <div>
                    <Image
                        src="/images/charity/charity6.png"
                        alt="Person"
                        width={500}
                        height={500}

                    />
                </div>

                {/* Right Text Section */}
                <div className="w-2/3 pl-[50px] flex flex-col justify-center">
                    <h3 className="text-[#0B0112]">Samaritans</h3>
                    <p className="text-[10px] text-[#611192] font-semibold">CHARITY NUMBER: 000000</p>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                        Lorem ipsum dolor sit amet consectetur. Tempus suscipit nisl auctor ut nulla accumsan ut tortor sem. <br />
                        Amet ac dolor varius faucibus in risus. Lorem ipsum dolor sit amet consectetur. Tempus suscipit nisl <br />
                        auctor ut nulla accumsan ut tortor sem. Amet ac dolor varius faucibus in risus.
                    </p>

                    <div className="mt-6 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                           
                            <span className="text-[#000]">116 123</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            
                            <a href="https://www.samaritans.org" className="text-purple-600 hover:underline">
                                www.samaritans.org
                            </a>
                        </div>
                    </div>

                    <button className="mt-8 px-4 py-2 bg-[#0B0112] w-auto text-white">
                        Sign up
                    </button>
                </div>
            </div>
        </section>
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