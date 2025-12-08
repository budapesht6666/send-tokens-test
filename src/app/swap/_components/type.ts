import { z } from 'zod';

export type NetworkOption = {
  id: string;
  label: string;
  chip: string;
};

export type TokenOption = {
  symbol: string;
  name: string;
  usdPrice: number;
  balance: number;
};

export type Quote = {
  rate: number;
  slippagePercent: number;
  feeUsd: number;
  gasUsd: number;
};

export const swapFormSchema = z.object({
  network: z.string(),
  fromToken: z.string(),
  toToken: z.string(),
  fromAmount: z
    .string()
    .trim()
    .min(1, { message: 'Enter an amount' })
    .refine((value) => Number(value) > 0, { message: 'Amount must be greater than 0' }),
});

export type SwapFormValues = z.infer<typeof swapFormSchema>;
