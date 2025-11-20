'use client';

import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
};

/**
 * Кастомная кнопка подключения кошелька на базе ConnectButton.Custom.
 * Визуально согласована с shadcn/ui и Tailwind темой проекта.
 */
export function CustomConnectButton({ className, size = 'default' }: Props) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        // Скрываем контент до монтирования/готовности
        const wrapperProps = !ready
          ? ({
              'aria-hidden': true,
              style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' as const },
            } as const)
          : {};

        // Выбираем, что рендерить, в зависимости от состояния
        let content: React.ReactNode;

        if (!connected) {
          content = (
            <Button size={size} onClick={openConnectModal} data-id="CustomConnectButton">
              <span className="block sm:hidden">Connect</span>
              <span className="hidden sm:block">Connect Wallet</span>
            </Button>
          );
        } else if (chain?.unsupported) {
          content = (
            <Button variant="destructive" size={size} onClick={openChainModal}>
              Invalid network
            </Button>
          );
        } else {
          content = (
            <>
              {/* Desktop / tablet: две отдельные кнопки */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size={size}
                  onClick={openChainModal}
                  className="pr-3 shrink-0"
                  data-id="CustomConnectButton-Chain"
                >
                  {chain?.hasIcon && (
                    <span
                      className="mr-2 inline-flex size-4 items-center justify-center overflow-hidden rounded-full"
                      style={{ background: chain?.iconBackground }}
                    >
                      {chain?.iconUrl && (
                        <Image
                          alt={chain?.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          width={16}
                          height={16}
                          className="size-4"
                          unoptimized
                        />
                      )}
                    </span>
                  )}
                  <span className="truncate max-w-30">{chain?.name}</span>
                </Button>

                <Button
                  type="button"
                  variant="default"
                  size={size}
                  onClick={openAccountModal}
                  className="shrink-0"
                  data-id="CustomConnectButton-Account"
                >
                  <span className="truncate max-w-40">
                    {account?.displayName}
                    {account?.displayBalance ? ` (${account.displayBalance})` : ''}
                  </span>
                </Button>
              </div>

              {/* Mobile: один компактный триггер с меню */}
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      aria-label="Wallet menu"
                      className="shrink-0"
                      data-id="CustomConnectButton-MobileTrigger"
                    >
                      {chain?.hasIcon && chain?.iconUrl ? (
                        <span
                          className="mr-2 inline-flex size-4 items-center justify-center overflow-hidden rounded-full"
                          style={{ background: chain?.iconBackground }}
                        >
                          <Image
                            alt={chain?.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            width={16}
                            height={16}
                            className="size-4"
                            unoptimized
                          />
                        </span>
                      ) : null}
                      <span className="truncate max-w-28">{account?.displayName ?? 'Wallet'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={openAccountModal}
                      data-id="CustomConnectButton-MobileAccount"
                    >
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={openChainModal}
                      data-id="CustomConnectButton-MobileChain"
                    >
                      Network
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          );
        }

        return (
          <div className={cn('flex items-center gap-2', className)} {...wrapperProps}>
            {content}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}

export default CustomConnectButton;
