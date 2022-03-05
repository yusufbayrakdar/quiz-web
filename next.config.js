/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["https://firebasestorage.googleapis.com"],
  },
  source: "/api/:path*",
  destination: "https://bilsemiq-api.herokuapp.com/:path*",
};
