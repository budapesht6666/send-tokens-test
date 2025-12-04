import { chainMapper } from '@/actions/helpers';
import { formatUnits, type Address } from 'viem';
import {
  AlchemyTokenBalancesResponse,
  AlchemyTokenMetadataResponse,
  GetAlchemyTokenBalancesParams,
  WalletToken,
} from './types';

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export async function fetchAlchemyTokenBalances({
  address,
  chainId,
}: GetAlchemyTokenBalancesParams): Promise<WalletToken[]> {
  if (!apiKey) {
    return [];
  }

  const baseUrl = `https://${chainMapper[chainId]}.g.alchemy.com/v2/${apiKey}`;

  const balancesBody = {
    jsonrpc: '2.0',
    id: 0,
    method: 'alchemy_getTokenBalances',
    params: [address],
  } as const;

  const balancesResponse = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(balancesBody),
  });

  const balancesData: AlchemyTokenBalancesResponse = await balancesResponse.json();

  const nonErrored = balancesData.result.tokenBalances.filter((item) => !item.error);

  const tokens: WalletToken[] = [];

  for (const token of nonErrored) {
    if (!token.tokenBalance || token.tokenBalance === '0x0') continue;

    const metadataBody = {
      jsonrpc: '2.0',
      id: 0,
      method: 'alchemy_getTokenMetadata',
      params: [token.contractAddress],
    } as const;

    const metadataResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadataBody),
    });

    const metadataData: AlchemyTokenMetadataResponse = await metadataResponse.json();

    const { symbol, name, decimals } = metadataData.result;

    if (!symbol || decimals == null) continue;

    const numericBalance = BigInt(token.tokenBalance);
    if (numericBalance === BigInt(0)) continue;

    const formattedBalance = formatUnits(numericBalance, decimals);

    tokens.push({
      address: token.contractAddress as Address,
      symbol,
      name: name ?? symbol,
      decimals,
      rawBalance: token.tokenBalance,
      balance: formattedBalance,
    });
  }

  return tokens;
}
