import { chainMapper } from '@/actions/helpers';
import {
  AlchemyErrorType,
  GetAlchemyHistoryParams,
  GetAlchemyHistoryResponse,
} from '@/actions/types';

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export async function fetchAlchemyHistory({
  address,
  chainId,
}: GetAlchemyHistoryParams): Promise<GetAlchemyHistoryResponse | AlchemyErrorType> {
  const url = `https://${chainMapper[chainId]}.g.alchemy.com/v2/${apiKey}`;

  const body = {
    jsonrpc: '2.0',
    id: 0,
    method: 'alchemy_getAssetTransfers',
    params: [
      {
        fromBlock: '0x0',
        fromAddress: address,
        category: ['external', 'erc20', 'erc721', 'erc1155'],
      },
    ],
  } as const;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data: GetAlchemyHistoryResponse | AlchemyErrorType = await response.json();

  return data;
}
