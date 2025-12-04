import { QueryObserverResult, RefetchOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import { fetchAlchemyTokenBalances } from '@/actions/getAlchemyTokenBalances.client';
import type { WalletToken } from '@/actions/types';

type UseTokenBalancesParams = {
  address?: Address;
  chainId?: number;
  isConnected: boolean;
};

type UseTokenBalancesResult = {
  tokens: WalletToken[];
  isLoading: boolean;
  isError: boolean;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<WalletToken[], Error>>;
};

export function useTokenBalances({
  address,
  chainId,
  isConnected,
}: UseTokenBalancesParams): UseTokenBalancesResult {
  const enabled = Boolean(isConnected && address && chainId);

  const { data, isPending, isError, refetch } = useQuery<
    WalletToken[],
    Error,
    WalletToken[],
    ['alchemy-token-balances', Address | undefined, number | undefined]
  >({
    queryKey: ['alchemy-token-balances', address, chainId],
    enabled,
    queryFn: async () => {
      if (!address || !chainId) {
        throw new Error('Missing address or chainId');
      }

      const balances = await fetchAlchemyTokenBalances({ address, chainId });

      return balances;
    },
  });

  return {
    tokens: data ?? [],
    isLoading: isPending && enabled,
    isError,
    refetch,
  };
}
