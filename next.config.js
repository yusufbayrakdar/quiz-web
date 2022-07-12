/** @type {import('next').NextConfig} */

// next.config.js

// You can choose which headers to add to the list
// after learning more below.
const securityHeaders = [
  {
    key: "Referrer-Policy",
    value: "origin",
  },
];

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;
