/* eslint-disable @typescript-eslint/no-explicit-any */
// import { blogData } from "@/libs/blogs";
import Image from "next/image";

const CharityDetailsPage = () => {
  // const blogId = params;

  // const blog = blogData.find(
  //   (blogData) => blogData.id === blogId.blogId
  // );

  return (
    <section className="mb-10">
      <header className="relative">
        <Image
          src="/images/blog/hero.png"
          alt="Header"
          className="w-full h-[434px] object-cover"
          width={1440}
          height={434}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-blog-hero bg-opacity-70 p-8">
          <div className="container mb-7">
            <h3 className="text-white text-xl mb-3">
              Clothes, careers and community: the impact of charity shops
            </h3>
            <p className="text-white text-sm">
              Stay updated with the latest news, tips, and stories from Angelpage. Learn more about sustainable living, charitable giving, and the impact of your contributions.
            </p>
          </div>
        </div>
      </header>
      <div className="container pt-[67px] grid grid-cols-3 sm:grid-cols-1 gap-12">
        {/* Main Content */}
        <article className="col-span-2">
          <p className="mb-8 text-lg text-[#000000]">
            Lorem ipsum dolor sit amet consectetur. Senectus pellentesque id ornare blandit id sit. Mauris nisi quam nibh ut id turpis morbi ut eget. In netus venenatis feugiat nibh et. Commodo duis sem justo turpis convallis ut sapien. Consectetur iaculis mi facilisis faucibus id adipiscing volutpat. Tortor eget bibendum facilisis magna etiam eget. Mattis hendrerit et sed pellentesque nulla tellus nunc adipiscing. Congue libero volutpat dignissim scelerisque. Enim sagittis neque senectus fringilla faucibus scelerisque.
          </p>
          <p> Malesuada ac facilisis egestas diam tincidunt est urna imperdiet. Pretium sem sed nulla scelerisque interdum cursus faucibus mattis. Commodo sed a praesent donec ornare dui id vel tincidunt. Id at facilisis aliquet commodo. Nunc ipsum amet sollicitudin enim nec diam magna ullamcorper sem. Sagittis interdum et dignissim urna enim gravida fermentum velit sodales. Eget ante metus varius pretium enim amet pellentesque lacus.</p>
          <Image src="/images/blog/desc.png"
            alt="Inside article"
            className="w-full border border-blue-500 mt-[39px] mb-[50px]" width={847} height={271} />
          <p className="mt-8 text-lg text-[#000000]">
            it ullamcorper blandit malesuada aliquet non porttitor. Ultrices tempor sapien massa at enim egestas. Tortor donec odio velit ac morbi consectetur velit. Et elementum mauris diam hac gravida ultricies ridiculus at. Orci turpis placerat id aenean laoreet amet et consequat montes. Turpis sed nec vestibulum venenatis ante semper accumsan duis mattis. Scelerisque sem malesuada nec diam egestas cras. In nascetur blandit rutrum gravida felis. Tellus viverra varius purus arcu enim eget cursus. Vitae nibh semper ut eu tristique nisi ipsum ac.
          </p>
        </article>

        {/* Author Info */}
        <aside className="col-span-1 flex flex-col items-center lg:items-start text-[14px]">
          <div>
            <p className=" text-[#000]">Author</p>
            <div className="flex mt-3 gap-4">
              <Image src='/images/blog/author.png' alt='Author' width={60} height={60}></Image>
              <div>
                <p className="text-xl font-semibold">Jane Doe</p>
                <p className="text-sm text-[#000]">Volunteer</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default CharityDetailsPage;
