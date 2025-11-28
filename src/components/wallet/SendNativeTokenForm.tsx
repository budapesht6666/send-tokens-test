import { z } from 'zod';
import { isAddress, type Address } from 'viem';
import { FormInput } from '@/components/formAdapters/FormInput/FormInput';
import { FormSelect } from '@/components/formAdapters/FormSelect/FormSelect';

export const sendNativeSchema = z.object({
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
  token: z.string().trim(),
});

export type SendNativeFormValues = z.infer<typeof sendNativeSchema>;

type WalletTokenView = {
  address: Address;
  symbol: string;
  balance: string;
};

type SendNativeTokenFormProps = {
  tokens: WalletTokenView[];
  isTokensLoading: boolean;
  nativeBalance: { symbol: string } | undefined;
  onSetMax: () => void;
};

export function SendNativeTokenForm({
  tokens,
  isTokensLoading,
  nativeBalance,
  onSetMax,
}: SendNativeTokenFormProps) {
  return (
    <>
      <FormSelect
        name="token"
        label="Token"
        placeholder="Select token"
        options={[
          { value: 'native', label: 'Native' },
          ...tokens.map((token) => ({
            value: token.address,
            label: `${token.symbol} (${token.balance})`,
          })),
        ]}
        disabled={isTokensLoading}
      />

      <FormInput name="to" label="Recipient address" placeholder="0x..." autoComplete="off" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Amount</span>
          <button
            type="button"
            className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onSetMax}
            disabled={!nativeBalance && tokens.length === 0}
          >
            Max
          </button>
        </div>
        <FormInput name="amount" type="number" step="0.0001" min="0" placeholder="0.1" />
      </div>
    </>
  );
}
