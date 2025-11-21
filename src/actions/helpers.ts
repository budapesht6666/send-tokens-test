import { polygonAmoy, arbitrumSepolia } from 'wagmi/chains';

export const chainMapper: Record<number, string> = {
  [polygonAmoy.id]: 'polygon-amoy',
  [arbitrumSepolia.id]: 'arb-sepolia',
};
