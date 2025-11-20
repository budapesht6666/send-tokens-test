'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAddress, parseEther } from 'viem';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import { arbitrumSepolia, polygonAmoy } from 'wagmi/chains';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/formAdapters/FormInput/FormInput';

const sendNativeSchema = z.object({
  to: z
    .string()
    .trim()
    .refine((value) => isAddress(value), { message: 'Invalid address' }),
  amount: z
    .string()
    .trim()
    .refine((value) => Number(value) > 0, {
      message: 'Amount must be greater than 0',
    }),
});

type SendNativeFormValues = z.infer<typeof sendNativeSchema>;

export function SendNativeTokenForm() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();

  const [txLink, setTxLink] = useState<string | null>(null);

  const form = useForm<SendNativeFormValues>({
    resolver: zodResolver(sendNativeSchema),
    defaultValues: {
      to: '',
      amount: '',
    },
  });

  const onSubmit = async (values: SendNativeFormValues) => {
    if (!walletClient) {
      toast.error('Wallet is not connected');
      return;
    }

    setTxLink(null);

    try {
      const hash = await walletClient.sendTransaction({
        account: walletClient.account!,
        chain: walletClient.chain,
        to: values.to as `0x${string}`,
        value: parseEther(values.amount),
      });

      const explorerBase =
        chainId === polygonAmoy.id
          ? polygonAmoy.blockExplorers?.default.url
          : chainId === arbitrumSepolia.id
          ? arbitrumSepolia.blockExplorers?.default.url
          : undefined;

      const link = explorerBase ? `${explorerBase}/tx/${hash}` : hash;
      setTxLink(link);
      form.reset({
        to: '',
        amount: '',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send transaction';
      toast.error('Failed to send transaction', {
        description: message,
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="space-y-1 text-center">
          <h2 className="text-lg font-semibold">Send native token</h2>
          <p className="text-sm text-muted-foreground">
            Enter recipient address, amount and select a network.
          </p>
        </div>

        {txLink && (
          <div className="mt-4 break-all rounded-md border border-green-200 bg-green-50 p-2 text-xs text-green-700">
            Transaction sent:{' '}
            <a
              href={txLink}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              View in explorer
            </a>
          </div>
        )}

        <Form {...form}>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <FormInput
                name="to"
                label="Recipient address"
                placeholder="0x..."
                autoComplete="off"
              />

              <FormInput
                name="amount"
                label="Amount (native token)"
                type="number"
                step="0.0001"
                min="0"
                placeholder="0.1"
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !isConnected || !walletClient}
              >
                {isSubmitting ? 'Sending...' : isConnected ? 'Send' : 'Connect wallet'}
              </Button>
            </form>
          </FormProvider>
        </Form>
      </div>
    </div>
  );
}
