'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAddress, parseEther } from 'viem';
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';
import { arbitrumSepolia, polygonAmoy } from 'wagmi/chains';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  chainId: z.enum([
    String(polygonAmoy.id) as `${number}`,
    String(arbitrumSepolia.id) as `${number}`,
  ]),
});

type SendNativeFormValues = z.infer<typeof sendNativeSchema>;

const CHAINS = [polygonAmoy, arbitrumSepolia] as const;

export function SendNativeTokenForm() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { chains, switchChain, isPending: isSwitching } = useSwitchChain();

  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<SendNativeFormValues>({
    resolver: zodResolver(sendNativeSchema),
    defaultValues: {
      to: '',
      amount: '',
      chainId: String(polygonAmoy.id) as `${number}`,
    },
  });

  const onSubmit = async (values: SendNativeFormValues) => {
    if (!walletClient) {
      setErrorMessage('Wallet is not connected');
      return;
    }

    setTxHash(null);
    setErrorMessage(null);

    const targetChainId = Number(values.chainId);
    const targetChain = CHAINS.find((chain) => chain.id === targetChainId);

    if (!targetChain) {
      setErrorMessage('Selected network is not supported');
      return;
    }

    try {
      const availableChain = chains.find((chain) => chain.id === targetChain.id);

      if (availableChain && switchChain && walletClient.chain?.id !== targetChain.id) {
        await switchChain({ chainId: targetChain.id });
      }

      const hash = await walletClient.sendTransaction({
        account: walletClient.account!,
        chain: targetChain,
        to: values.to as `0x${string}`,
        value: parseEther(values.amount),
      });

      setTxHash(hash);
      form.reset({
        to: '',
        amount: '',
        chainId: String(targetChain.id) as `${number}`,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send transaction';
      setErrorMessage(message);
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

        {txHash && (
          <div className="mt-4 break-all rounded-md border border-green-200 bg-green-50 p-2 text-xs text-green-700">
            Transaction sent: {txHash}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">
            Error: {errorMessage}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="chainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHAINS.map((chain) => (
                          <SelectItem key={chain.id} value={String(chain.id)}>
                            {chain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (native token)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.0001" min="0" placeholder="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isSwitching || !isConnected || !walletClient}
            >
              {isSubmitting || isSwitching ? 'Sending...' : isConnected ? 'Send' : 'Connect wallet'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
