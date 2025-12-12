import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Plus tard, on ajoutera ici le domaine de votre Odoo
      // {
      //   protocol: 'https',
      //   hostname: 'votre-instance-odoo.com',
      // },
    ],
  },
};

export default nextConfig;
