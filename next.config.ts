import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'votre-odoo-url.com', // Remplace par ton URL Odoo réelle
        port: '',
        pathname: '/web/image/**',
      },
    ],
  },
};

export default nextConfig;
