import { useEffect, useState } from 'react';
import type { Address } from 'viem';

import { fetchAlchemyTokenBalances } from '@/actions/getAlchemyTokenBalances.client';
import { WalletToken } from '@/actions/types';

type UseTokenBalancesParams = {
  address?: Address;
  chainId?: number;
};

type UseTokenBalancesResult = {
  tokens: WalletToken[];
  isLoading: boolean;
  isError: boolean;
};

export function useTokenBalances({
  address,
  chainId,
}: UseTokenBalancesParams): UseTokenBalancesResult {
  const [tokens, setTokens] = useState<WalletToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!address || !chainId) {
      setTokens([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const data = await fetchAlchemyTokenBalances({ address, chainId });
        if (!cancelled) {
          setTokens(data);
        }
      } catch (error) {
        console.warn('load error:', error);
        if (!cancelled) {
          setIsError(true);
          setTokens([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [address, chainId]);

  return { tokens, isLoading, isError };
}
