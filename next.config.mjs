/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com'], // Allow Cloudinary images
    },
    async headers() {
        return [
            {
                source: '/(.*)', // Apply to all routes
                headers: [
                    {
                        key: 'X-Robots-Tag',
                        value: 'noindex, nofollow',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
