import type { NextConfig } from 'next';

const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath,
};

export default nextConfig;
