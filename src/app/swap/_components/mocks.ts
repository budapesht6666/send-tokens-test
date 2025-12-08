import type { NetworkOption, Quote, SwapFormValues, TokenOption } from './type';

export const NETWORKS: NetworkOption[] = [
  { id: 'arbitrum', label: 'Arbitrum', chip: 'ARB' },
  { id: 'base', label: 'Base', chip: 'BASE' },
  { id: 'optimism', label: 'Optimism', chip: 'OP' },
];

export const TOKENS: TokenOption[] = [
  { symbol: 'ETH', name: 'Ethereum', usdPrice: 3147.462, balance: 0.0016178 },
  { symbol: 'USDC', name: 'USD Coin', usdPrice: 1, balance: 0 },
  { symbol: 'USDT', name: 'Tether', usdPrice: 1, balance: 12.5231 },
];

export const QUOTES: Record<string, Quote> = {
  ETH_USDC: { rate: 3147.462, slippagePercent: 1.89, feeUsd: 0.03, gasUsd: 0.03 },
  ETH_USDT: { rate: 3147.462, slippagePercent: 1.5, feeUsd: 0.04, gasUsd: 0.03 },
  USDC_ETH: { rate: 1 / 3147.462, slippagePercent: 1.3, feeUsd: 0.02, gasUsd: 0.03 },
  USDT_ETH: { rate: 1 / 3147.462, slippagePercent: 1.3, feeUsd: 0.02, gasUsd: 0.03 },
  USDC_USDT: { rate: 1, slippagePercent: 0.2, feeUsd: 0.01, gasUsd: 0.01 },
  USDT_USDC: { rate: 1, slippagePercent: 0.2, feeUsd: 0.01, gasUsd: 0.01 },
};

export const DEFAULT_VALUES: SwapFormValues = {
  network: 'arbitrum',
  fromToken: 'ETH',
  toToken: 'USDC',
  fromAmount: '0.0015178271268766',
};
