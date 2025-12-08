import { FormEvent, useMemo, useState } from 'react';
import { Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const PRESET_VALUES = [1, 2];

type SlippageMode = 'auto' | 'preset' | 'custom';

type SwapSlippageControlProps = {
  autoValue?: number;
};

export const SwapSlippageControl = ({ autoValue = 1.5 }: SwapSlippageControlProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<SlippageMode>('auto');
  const [value, setValue] = useState(autoValue);
  const [customInput, setCustomInput] = useState('');

  const currentValue = mode === 'auto' ? autoValue : value;

  const displayValue = useMemo(() => currentValue?.toFixed(2), [currentValue]);
  const inlineLabel = mode === 'auto' ? 'Auto Slippage' : 'Max Slippage';

  const handlePresetSelect = (nextValue: number, nextMode: SlippageMode) => {
    setMode(nextMode);
    setValue(nextMode === 'auto' ? autoValue : nextValue);
    setOpen(false);
  };

  const handleCustomSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const parsed = Number(customInput);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return;
    }

    setMode('custom');
    setValue(parsed);
    setCustomInput('');
    setOpen(false);
  };

  return (
    <div className="flex w-full flex-col gap-1 text-left text-sm text-muted-foreground sm:w-auto sm:items-center sm:justify-end sm:gap-2 sm:text-right">
      <span data-id="111111" className="text-xs font-semibold uppercase text-muted-foreground">
        {inlineLabel}:
      </span>
      <div className="flex items-center gap-1.5 text-base font-semibold text-foreground">
        <span>{displayValue ?? '--'}%</span>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label="Adjust slippage"
            >
              <Settings2 className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 space-y-4 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-xl">
            <div>
              <p className="text-sm font-semibold text-foreground">Max slippage</p>
              <p className="text-xs text-muted-foreground">
                Choose a preset or provide a custom limit.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PRESET_VALUES.map((preset) => {
                const isActive = mode !== 'auto' && value === preset;
                return (
                  <Button
                    key={preset}
                    type="button"
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    className={cn('rounded-xl', isActive && 'shadow-sm')}
                    onClick={() => handlePresetSelect(preset, 'preset')}
                  >
                    {preset.toFixed(2)} %
                  </Button>
                );
              })}
              <Button
                type="button"
                size="sm"
                variant={mode === 'auto' ? 'default' : 'outline'}
                className={cn('rounded-xl', mode === 'auto' && 'shadow-sm')}
                onClick={() => handlePresetSelect(autoValue, 'auto')}
              >
                Auto
              </Button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Custom
              </div>
              <form className="flex items-center gap-2" onSubmit={handleCustomSubmit}>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.50"
                  value={customInput}
                  onChange={(event) => setCustomInput(event.target.value)}
                  className="h-9 flex-1 rounded-xl"
                />
                <span className="text-sm text-muted-foreground">%</span>
                <Button type="submit" size="sm" className="rounded-xl">
                  Set
                </Button>
              </form>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
