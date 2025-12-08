import { formatTokenAmount } from './helpers';
import type { TokenOption } from './type';

export const TokenOptionView = ({ token }: { token: TokenOption }) => (
  <span className="flex w-full items-center gap-3">
    <span className="text-base font-semibold text-foreground">{token.symbol}</span>
    <span className="text-xs text-muted-foreground">{token.name}</span>
    <span className="ml-auto text-xs text-muted-foreground">
      Balance {formatTokenAmount(token.balance)}
    </span>
  </span>
);
