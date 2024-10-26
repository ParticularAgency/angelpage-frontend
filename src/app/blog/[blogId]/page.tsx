'use client'; // Enable client-side rendering
import { blogData } from '@/libs/blogs'; // Import your blog data
import Image from 'next/image'; // Import Next.js Image component
import Link from 'next/link'; // Import Next.js Link component
import { useParams } from 'next/navigation'; // Import useParams from next/navigation

// Define a type for the params
interface Params {
  blogId: string; // Expect blogId to be a string
}

const CharityDetailsPage: React.FC = () => {
  // Use 'unknown' to safely cast the params
  const params = useParams() as unknown; // Cast to unknown first
  const { blogId } = params as Params; // Then cast to Params

  console.log('Blog ID:', blogId); // Log the blogId to check its value
  console.log('Blog Data:', blogData); // Log the blog data for debugging

  // Check if blogId is defined and find the corresponding blog
  const blog = blogId
    ? blogData.find(blog => {
        console.log('Comparing:', blog.id, 'with:', blogId); // Log comparison
        return blog.id === blogId; // Compare as strings
      })
    : null;

  if (!blog) {
    return (
      <section className="mb-10 text-center">
        <h1 className="text-2xl font-bold">Blog Not Found</h1>
        <p className="text-lg">
          The blog post you are looking for does not exist.
        </p>
        <Link href="/charities">
          <button className="mt-4 px-4 py-2 bg-[#0B0112] text-white">
            Back to Charities
          </button>
        </Link>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <header className="relative">
        <Image
          src={blog.image}
          alt={blog.title}
          className="w-full h-[434px] object-cover"
          width={1440}
          height={434}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-blog-hero bg-opacity-70 p-8">
          <div className="container mb-7">
            <h3 className="text-white text-xl mb-3">{blog.title}</h3>
            <p className="text-white text-sm">{blog.description}</p>
          </div>
        </div>
      </header>
      <div className="container pt-[67px] grid grid-cols-3 sm:grid-cols-1 gap-12">
        {/* Main Content */}
        <article className="col-span-2">
          <p className="mb-8 text-lg text-[#000000]">
            {blog.description} {/* Use dynamic content */}
          </p>
          <Image
            src={blog.image || '/images/blog/desc.png'} // Use dynamic image or fallback
            alt="Inside article"
            className="w-full border border-blue-500 mt-[39px] mb-[50px]"
            width={847}
            height={271}
          />
          <p className="mt-8 text-lg text-[#000000]">
            {blog.description} {/* Use additional content */}
          </p>
        </article>

        {/* Author Info */}
        <aside className="col-span-1 flex flex-col items-center lg:items-start text-[14px]">
          <div>
            <p className="text-[#000]">Author</p>
            <div className="flex mt-3 gap-4">
              <Image
                src="/images/blog/author.png" // Use dynamic author image or fallback
                alt="Author"
                width={60}
                height={60}
              />
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
