'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatUnits, parseEther, parseUnits, type Address } from 'viem';
import {
  BaseError,
  useAccount,
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWalletClient,
} from 'wagmi';
import { toast } from 'sonner';

import { useTokenBalances } from '@/hooks/useTokenBalances';
import {
  sendNativeSchema,
  type SendNativeFormValues,
} from '@/components/wallet/SendNativeTokenForm';
import { SendNativeTokenForm } from '@/components/wallet/SendNativeTokenForm';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { erc20Abi } from './erc20Abi';

export function SendNativeTokenFormContainer() {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: nativeBalance } = useBalance({
    address,
    chainId: walletClient?.chain.id,
    query: {
      enabled: Boolean(address && walletClient?.chain.id),
    },
  });

  const { tokens, isLoading: isTokensLoading } = useTokenBalances({
    address,
    chainId: walletClient?.chain.id,
  });
  console.log('tokens:', tokens);

  const methods = useForm<SendNativeFormValues>({
    resolver: zodResolver(sendNativeSchema),
    defaultValues: {
      to: '',
      amount: '',
      token: 'native',
    },
  });

  const { reset, setValue, getValues, handleSubmit } = methods;

  const onSubmit = async (values: SendNativeFormValues) => {
    if (!walletClient) {
      toast.error('Wallet is not connected');
      return;
    }

    try {
      if (values.token === 'native') {
        sendTransaction({
          to: values.to as `0x${string}`,
          value: parseEther(values.amount),
        });
      } else {
        const selectedToken = tokens.find((token) => token.address === values.token);

        if (!selectedToken) {
          toast.error('Selected token not found');
          return;
        }

        const txHash = await walletClient.writeContract({
          address: selectedToken.address,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [values.to as Address, parseUnits(values.amount, selectedToken.decimals)],
        });

        toast.success('Transaction sent', {
          description: txHash,
        });
      }

      reset({
        to: '',
        amount: '',
        token: 'native',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send transaction';
      toast.error('Failed to send transaction', {
        description: message,
      });
    }
  };

  const setMaxAmount = () => {
    const tokenValue = getValues('token');

    if (tokenValue === 'native') {
      if (!nativeBalance) return;

      const formatted = formatUnits(nativeBalance.value, nativeBalance.decimals ?? 18);

      setValue('amount', formatted, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    const selectedToken = tokens.find((token) => token.address === tokenValue);

    if (!selectedToken) {
      return;
    }

    setValue('amount', selectedToken.balance, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    const current = getValues('token');

    if (!current || (current !== 'native' && !tokens.some((t) => t.address === current))) {
      setValue('token', 'native', {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: true,
      });
    }
  }, [getValues, setValue, tokens]);

  return (
    <Form {...methods}>
      <div className="mx-auto max-w-md">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold">Send native token</h2>
            <p className="text-sm text-muted-foreground">
              Enter recipient address, amount and select a network.
            </p>
          </div>

          {hash && (
            <div className="mt-4 break-all rounded-md border border-green-200 bg-green-50 p-2 text-xs text-green-700">
              Transaction sent:{' '}
              <a
                href={`${walletClient?.chain.blockExplorers?.default.url}/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                View in explorer
              </a>
            </div>
          )}

          {error && <div>Error: {(error as BaseError).shortMessage || error.message}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <SendNativeTokenForm
              tokens={tokens}
              nativeBalance={nativeBalance}
              onSetMax={setMaxAmount}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!isConnected || !walletClient || isTokensLoading || isPending}
            >
              {isPending ? 'Sending...' : isConnected ? 'Send' : 'Connect wallet'}
            </Button>
          </form>

          <div className="mt-2">
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
          </div>
        </div>
      </div>
    </Form>
  );
}
