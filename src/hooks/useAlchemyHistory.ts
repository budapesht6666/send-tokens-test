import { useQuery } from '@tanstack/react-query';
import { AlchemyTransfer } from '@/actions/types';
import { Address } from 'viem';
import { fetchAlchemyHistory } from '@/actions/getAlchemyHistory.client';

type UseAlchemyHistoryParams = {
  address?: Address;
  chainId?: number;
  isConnected: boolean;
};

export const useAlchemyHistory = ({ address, chainId, isConnected }: UseAlchemyHistoryParams) => {
  const enabled = Boolean(isConnected && address && chainId);

  const { data, isPending, error } = useQuery<
    AlchemyTransfer[],
    Error,
    AlchemyTransfer[],
    ['alchemy-history', Address | undefined, number | undefined]
  >({
    queryKey: ['alchemy-history', address, chainId],
    enabled,
    queryFn: async () => {
      if (!address || !chainId) {
        throw new Error('Missing address or chainId');
      }

      const res = await fetchAlchemyHistory({ address, chainId });

      if ('error' in res) {
        throw new Error(res.error.message);
      }

      return res.result.transfers;
    },
    staleTime: 60_000,
  });

  return {
    transfers: data ?? [],
    transfersLoading: isPending && enabled,
    error,
  };
};
