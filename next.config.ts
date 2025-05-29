import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ceksxnfsszwkadypmabe.supabase.co',
            },
        ],
    },
};

export default nextConfig;