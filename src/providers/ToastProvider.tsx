'use client';

import { useTheme } from 'next-themes';
import { Toaster, ToasterProps } from 'sonner';

export const ToastProvider = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="bottom-center"
      richColors
      theme={resolvedTheme as ToasterProps['theme']}
      expand
      duration={3000}
      toastOptions={{
        className: 'rounded-lg shadow-lg text-sm',
      }}
    />
  );
};
