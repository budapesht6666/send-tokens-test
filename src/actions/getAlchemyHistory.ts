'use server';

import { chainMapper } from './helpers';
import { AlchemyErrorType, GetAlchemyHistoryParams, GetAlchemyHistoryResponse } from './types';

const apiKey = process.env.ALCHEMY_API_KEY;

export async function getAlchemyHistory({ address, chainId }: GetAlchemyHistoryParams) {
  const url = `https://${chainMapper[chainId]}.g.alchemy.com/v2/${apiKey}`;

  try {
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
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data: GetAlchemyHistoryResponse | AlchemyErrorType = await response.json();

    return data;
  } catch (error) {
    console.error('[getAlchemyHistory] Failed to fetch Alchemy History', { url, error });
    throw new Error('Failed to fetch Alchemy History');
  }
}
