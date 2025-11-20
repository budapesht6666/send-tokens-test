import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { cookieStorage, createStorage } from 'wagmi';
import { polygonAmoy, arbitrumSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: process.env.NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID ?? '',
  chains: [polygonAmoy, arbitrumSepolia],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
