'use client';

import { useState } from 'react';
import { Menu, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import CustomConnectButton from '../wallet/custom-connect-button';

export function MobileHeader() {
  const [open, setOpen] = useState(false);

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full',
        'border-b border-white/10',
        'bg-background/30 supports-backdrop-filter:bg-background/20',
        'backdrop-blur-xl backdrop-saturate-150',
        'shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.06)]',
      )}
    >
      <div className="mx-auto flex h-14 container items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu" className="rounded-full">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="p-4">
                <ul className="grid gap-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/" aria-label="Home page" onClick={handleNavClick}>
                      Send tokens
                    </Link>
                  </li>
                  <li>
                    <Link href="/history" aria-label="History page" onClick={handleNavClick}>
                      History
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" aria-label="About page" onClick={handleNavClick}>
                      About
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" aria-label="Home page">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-semibold">dApp</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <CustomConnectButton size="sm" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
