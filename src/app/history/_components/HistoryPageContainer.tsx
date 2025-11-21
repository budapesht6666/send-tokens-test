'use client';

import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useAlchemyHistory } from '@/hooks/useAlchemyHistory';

export const HistoryPageContainer = () => {
  const { isConnected, address, chainId } = useAccount();
  const { transfers, transfersLoading, error } = useAlchemyHistory({
    address,
    chainId,
    isConnected,
  });

  const hasTransfers = transfers.length > 0;

  const rows = useMemo(
    () =>
      [...transfers]
        .sort((a, b) => Number(b.blockNum) - Number(a.blockNum))
        .map((t) => ({
          id: t.hash,
          blockNum: t.blockNum,
          category: t.category,
          from: t.from,
          to: t.to,
          asset: t.asset,
          value: t.value,
        })),
    [transfers],
  );

  if (!isConnected || !address) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-muted-foreground">
        Connect wallet to see transfer history.
      </div>
    );
  }

  if (transfersLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <div className="rounded-md border">
          <div className="space-y-2 p-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p className="font-medium">Failed to load history.</p>
          <p className="text-xs text-destructive/80">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!hasTransfers) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-1 text-center text-sm text-muted-foreground">
        <div>No transfers found.</div>
        <div>Make a transfer and it will appear here.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full overflow-x-auto rounded-xl border border-border/60 bg-background/40 shadow-lg shadow-black/20 backdrop-blur">
        <div className="inline-block min-w-full align-middle">
          <Table className="min-w-[840px]">
            <TableHeader>
              <TableRow>
                <TableHead>Block</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{row.blockNum}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                        row.category === 'external' &&
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                        row.category === 'erc20' &&
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                      )}
                    >
                      {row.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold">{row.value}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{row.asset}</span>
                  </TableCell>
                  <TableCell>
                    <span className="truncate text-xs text-muted-foreground">{row.from}</span>
                  </TableCell>
                  <TableCell>
                    <span className="truncate text-xs text-muted-foreground">{row.to}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
