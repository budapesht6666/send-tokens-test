import { useEffect, useState } from 'react';
import { getAlchemyHistory } from '@/actions/getAlchemyHistory';
import { AlchemyTransfer } from '@/actions/types';
import { toast } from 'sonner';
import { Address } from 'viem';

type UseAlchemyHistoryParams = {
  address?: Address;
  chainId?: number;
  isConnected: boolean;
};

export const useAlchemyHistory = ({ address, chainId, isConnected }: UseAlchemyHistoryParams) => {
  const [transfersLoading, setTransfersLoading] = useState<boolean>(false);
  const [transfers, setTransfers] = useState<AlchemyTransfer[]>([]);

  useEffect(() => {
    if (!isConnected || !address || !chainId) return;

    const execute = async () => {
      setTransfersLoading(true);

      try {
        const res = await getAlchemyHistory({ address, chainId });

        if ('error' in res) {
          toast.error(res.error.message);
          return;
        }

        setTransfers(res.result.transfers);
      } catch (error) {
        console.warn(error);
        toast.error('Something went wrong ((');
      } finally {
        setTransfersLoading(false);
      }
    };

    void execute();
  }, [address, chainId, isConnected]);

  return { transfers, transfersLoading };
};
