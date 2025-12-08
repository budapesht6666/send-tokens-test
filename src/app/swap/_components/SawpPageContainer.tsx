'use client';

import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowDownUp, Gauge } from 'lucide-react';

import { FormInput } from '@/components/formAdapters/FormInput/FormInput';
import { FormSelect } from '@/components/formAdapters/FormSelect/FormSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import {
  calculateEstimatedToAmount,
  calculateFeeInToToken,
  calculateReceivedAmount,
  calculateSlippageAdjustedAmount,
  calculateUsdValue,
  formatCurrency,
  formatTokenAmount,
  formatTokenBalance,
  getQuote,
} from './helpers';
import { DEFAULT_VALUES, NETWORKS, QUOTES, TOKENS } from './mocks';
import { NetworkOptionView } from './NetworkOptionView';
import { TokenOptionView } from './TokenOptionView';
import { SwapSlippageControl } from './SwapSlippageControl';
import { swapFormSchema, type SwapFormValues } from './type';

export const SawpPageContainer = () => {
  const methods = useForm<SwapFormValues>({
    resolver: zodResolver(swapFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { control, getValues, handleSubmit, setValue } = methods;

  const fromToken = useWatch({ control, name: 'fromToken' });
  const toToken = useWatch({ control, name: 'toToken' });
  const fromAmount = useWatch({ control, name: 'fromAmount' });

  const fromTokenMeta = TOKENS.find((token) => token.symbol === fromToken);
  const toTokenMeta = TOKENS.find((token) => token.symbol === toToken);
  const quote = getQuote(QUOTES, fromToken, toToken);

  useEffect(() => {
    if (fromToken === toToken) {
      const fallback = TOKENS.find((token) => token.symbol !== fromToken);
      if (fallback) {
        setValue('toToken', fallback.symbol, {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: true,
        });
      }
    }
  }, [fromToken, setValue, toToken]);

  const estimatedToAmount = useMemo(
    () => calculateEstimatedToAmount(fromAmount, quote),
    [fromAmount, quote],
  );

  const slippageAdjusted = useMemo(
    () => calculateSlippageAdjustedAmount(estimatedToAmount, quote),
    [estimatedToAmount, quote],
  );

  const feeInToToken = useMemo(
    () => calculateFeeInToToken(quote, toTokenMeta),
    [quote, toTokenMeta],
  );

  const receivedAmount = useMemo(
    () => calculateReceivedAmount(slippageAdjusted, feeInToToken),
    [slippageAdjusted, feeInToToken],
  );

  const fromUsdValue = useMemo(
    () => calculateUsdValue(Number(fromAmount) || 0, fromTokenMeta),
    [fromAmount, fromTokenMeta],
  );

  const toUsdValue = useMemo(
    () => calculateUsdValue(estimatedToAmount, toTokenMeta),
    [estimatedToAmount, toTokenMeta],
  );

  const receivedUsd = useMemo(
    () => calculateUsdValue(receivedAmount, toTokenMeta),
    [receivedAmount, toTokenMeta],
  );

  const isSwapDisabled = !quote || Number(fromAmount) <= 0;

  const networkOptions = useMemo(
    () =>
      NETWORKS.map((option) => ({
        value: option.id,
        label: <NetworkOptionView option={option} />,
      })),
    [],
  );

  const tokenOptions = useMemo(
    () =>
      TOKENS.map((token) => ({ value: token.symbol, label: <TokenOptionView token={token} /> })),
    [],
  );

  const receiveTokenOptions = useMemo(
    () =>
      TOKENS.filter((token) => token.symbol !== fromToken).map((token) => ({
        value: token.symbol,
        label: <TokenOptionView token={token} />,
      })),
    [fromToken],
  );

  const onSubmit = (values: SwapFormValues) => {
    if (!quote) {
      toast.error('Quote unavailable for the selected pair');
      return;
    }

    toast.success('Mock swap prepared', {
      description: `Swapping ${values.fromAmount} ${values.fromToken} for ~${formatTokenAmount(
        receivedAmount,
      )} ${values.toToken} on ${
        NETWORKS.find((net) => net.id === values.network)?.label ?? 'unknown'
      }.`,
    });
  };

  const handleMaxAmount = () => {
    if (!fromTokenMeta) return;
    setValue('fromAmount', String(fromTokenMeta.balance), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleFlipTokens = () => {
    const currentFrom = getValues('fromToken');
    const currentTo = getValues('toToken');
    if (currentFrom === currentTo) return;

    setValue('fromToken', currentTo, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue('toToken', currentFrom, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <Form {...methods}>
      <div className="mx-auto w-full max-w-md space-y-4 sm:max-w-xl">
        <div className="rounded-3xl border border-border/60 bg-card/90 p-4 shadow-lg shadow-black/5 backdrop-blur sm:p-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">Swap tokens</h2>
            <p className="text-sm text-muted-foreground">Select network, coins, and slippage.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <FormSelect
                name="network"
                className="w-full sm:flex-1"
                label={
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Network
                  </span>
                }
                placeholder="Select network"
                options={networkOptions}
              />

              <SwapSlippageControl autoValue={quote?.slippagePercent} />
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-border/70 bg-card/40 p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                  <span>You pay</span>
                  <span>Balance {formatTokenBalance(fromTokenMeta?.balance)}</span>
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <FormInput
                      name="fromAmount"
                      type="number"
                      step="0.0000001"
                      inputMode="decimal"
                      autoComplete="off"
                      className="border-none bg-transparent text-3xl font-semibold tracking-tight focus-visible:border-none focus-visible:ring-0"
                    />
                  </div>

                  <FormSelect
                    name="fromToken"
                    placeholder="Token"
                    options={tokenOptions}
                    className="sm:min-w-40"
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>{formatCurrency(fromUsdValue)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase">MAX</span>
                    <Button
                      type="button"
                      variant="ghost"
                      className="px-0 text-primary"
                      onClick={handleMaxAmount}
                    >
                      Use balance
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={handleFlipTokens}
                >
                  <ArrowDownUp className="size-4" />
                </Button>
              </div>

              <div className="rounded-3xl border border-border/70 bg-card/40 p-4 sm:p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted-foreground">
                  <span>You receive</span>
                  <span>Current balance {formatTokenBalance(toTokenMeta?.balance)}</span>
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <div className="text-3xl font-semibold tracking-tight">
                      {formatTokenAmount(estimatedToAmount)}
                    </div>
                    <p className="text-sm text-muted-foreground">{formatCurrency(toUsdValue)}</p>
                  </div>

                  <FormSelect
                    name="toToken"
                    placeholder="Token"
                    options={receiveTokenOptions}
                    className="sm:min-w-40"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-border/70 bg-muted/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold">
                <span>
                  1 {fromToken} ≃{' '}
                  {quote ? quote.rate.toLocaleString('en-US', { maximumFractionDigits: 3 }) : '--'}{' '}
                  {toToken}
                </span>
                <span className="text-muted-foreground">Realtime quote (mocked)</span>
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Costs & Fees</dt>
                  <dd className="font-medium">{formatCurrency(quote?.feeUsd ?? 0)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Received</dt>
                  <dd className="font-semibold">
                    {formatTokenAmount(receivedAmount)} {toToken}
                    <span className="ml-2 text-muted-foreground">
                      ({formatCurrency(receivedUsd)})
                    </span>
                  </dd>
                </div>
              </dl>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Gauge className="size-4" />
                Gas estimate {formatCurrency(quote?.gasUsd ?? 0.03)}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSwapDisabled}
              className="h-12 w-full text-base font-semibold"
            >
              Swap
            </Button>
          </form>
        </div>
      </div>
    </Form>
  );
};
