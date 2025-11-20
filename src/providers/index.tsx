'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { config } from '@/lib/wagmi';
import { ThemedRainbowKitProvider } from './ThemedRainbowKitProvider';
import { ToastProvider } from './ToastProvider';

const queryClient = new QueryClient();

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <ToastProvider />
          <ThemedRainbowKitProvider>{children}</ThemedRainbowKitProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
