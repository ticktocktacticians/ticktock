import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	compiler: {
		reactRemoveProperties: { properties: ["^data-testid$"] },
	},
	eslint: {
		// Disable ESLint during production builds
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
