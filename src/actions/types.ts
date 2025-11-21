import { Address } from 'viem';

export type GetAlchemyHistoryParams = {
  chainId: number;
  address: Address;
};

export type AlchemyTransferCategory =
  | 'external'
  | 'internal'
  | 'erc20'
  | 'erc721'
  | 'erc1155'
  | 'specialnft';

export type AlchemyRawContract = {
  value: string;
  address: string | null;
  decimal: string | null;
};

export type AlchemyTransfer = {
  asset: string;
  blockNum: string;
  category: AlchemyTransferCategory;
  erc721TokenId: string | null;
  erc1155Metadata: null;
  from: string;
  hash: string;
  metadata: null;
  rawContract: AlchemyRawContract;
  to: string;
  tokenId: string | null;
  uniqueId: string;
  value: number;
};

export type GetAlchemyHistoryResponse = {
  result: { transfers: AlchemyTransfer[] };
};

export type AlchemyErrorType = {
  error: {
    code: number;
    message: string;
  };
};
