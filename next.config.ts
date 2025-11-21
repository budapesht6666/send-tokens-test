import type { NextConfig } from 'next';

const isPages = !!process.env.PAGES_BASE_PATH;
console.log('process.env.PAGES_BASE_PATH:', process.env.PAGES_BASE_PATH);

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath: isPages ? '/send-tokens-test' : undefined,
  assetPrefix: isPages ? '/send-tokens-test/' : undefined,
};

export default nextConfig;
