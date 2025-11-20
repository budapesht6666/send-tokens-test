'use client';

import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { useTheme } from 'next-themes';
import { useDomLoaded } from '@/hooks/useDomLoaded';

type Props = {
  children: React.ReactNode;
};

export const ThemedRainbowKitProvider = ({ children }: Props) => {
  const { resolvedTheme } = useTheme();
  const isDomLoaded = useDomLoaded();

  // Используем тему RainbowKit, синхронизированную с темой приложения и переменными Tailwind
  const rkTheme =
    (resolvedTheme ?? 'dark') === 'dark'
      ? darkTheme({
          accentColor: 'hsl(var(--primary))',
          accentColorForeground: 'hsl(var(--primary-foreground))',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'small',
        })
      : lightTheme({
          accentColor: 'hsl(var(--primary))',
          accentColorForeground: 'hsl(var(--primary-foreground))',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'small',
        });

  return (
    <RainbowKitProvider theme={isDomLoaded ? rkTheme : darkTheme()}>{children}</RainbowKitProvider>
  );
};
