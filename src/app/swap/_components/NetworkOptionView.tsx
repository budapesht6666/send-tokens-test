import type { NetworkOption } from './type';

export const NetworkOptionView = ({ option }: { option: NetworkOption }) => (
  <span className="flex items-center gap-2">
    <span className="text-sm font-semibold text-foreground">{option.label}</span>
  </span>
);
