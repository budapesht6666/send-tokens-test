'use client';

import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useId } from 'react';
import { useDomLoaded } from '@/hooks/useDomLoaded';

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const id = useId();
  const isDomLoaded = useDomLoaded();

  if (!isDomLoaded) {
    return null;
  }

  return (
    <button
      id={id}
      aria-label="Toggle theme"
      role="switch"
      aria-checked={isDarkTheme}
      onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')}
      className={cn(
        'inline-flex h-9 w-18 items-center rounded-full border border-border/50 bg-card p-1 text-foreground shadow-sm transition-colors cursor-pointer',
        'data-[pressed=true]:bg-muted',
        className,
      )}
      data-pressed={isDarkTheme}
    >
      <span
        className={cn(
          'grid h-7 w-7 place-items-center rounded-full transition-all',
          isDarkTheme
            ? 'translate-x-8 bg-primary text-primary-foreground'
            : 'translate-x-0 bg-muted text-muted-foreground',
        )}
      >
        {isDarkTheme ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      {/* icons backdrop */}
      {isDarkTheme && (
        <span className="pointer-events-none absolute ml-2 text-muted-foreground">
          <Sun className="h-4 w-4" />
        </span>
      )}

      {!isDarkTheme && (
        <span className="pointer-events-none absolute ml-10.5 text-muted-foreground">
          <Moon className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}
