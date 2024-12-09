/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        staleTimes: {
            dynamic: 30,
        }
    },
    images: {
        remotePatterns: [{ hostname: 'lh3.googleusercontent.com' }],
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
