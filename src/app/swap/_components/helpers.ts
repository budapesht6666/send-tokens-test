import type { Quote, TokenOption } from './type';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const tokenFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 6,
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const formatTokenAmount = (value?: number) => tokenFormatter.format(value ?? 0);

export const calculateEstimatedToAmount = (rawAmount: string, quote?: Quote) => {
  if (!quote) return 0;
  const parsed = Number(rawAmount);
  if (Number.isNaN(parsed)) return 0;
  return parsed * quote.rate;
};

export const calculateSlippageAdjustedAmount = (estimatedAmount: number, quote?: Quote) => {
  if (!quote) return 0;
  return estimatedAmount * (1 - quote.slippagePercent / 100);
};

export const calculateFeeInToToken = (quote?: Quote, token?: TokenOption) => {
  if (!quote) return 0;
  return (quote.feeUsd + quote.gasUsd) / (token?.usdPrice ?? 1);
};

export const calculateReceivedAmount = (slippageAdjusted: number, feeInToToken: number) =>
  Math.max(slippageAdjusted - feeInToToken, 0);

export const calculateUsdValue = (amount: number, token?: TokenOption) =>
  amount * (token?.usdPrice ?? 0);

export const getQuote = (quotes: Record<string, Quote>, fromToken?: string, toToken?: string) => {
  if (!fromToken || !toToken) return undefined;
  return quotes[`${fromToken}_${toToken}`];
};

export const formatTokenBalance = (balance?: number) => formatTokenAmount(balance ?? 0);
