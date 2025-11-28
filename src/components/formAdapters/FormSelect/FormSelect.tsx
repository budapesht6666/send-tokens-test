'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { useFormContext, type UseControllerProps } from 'react-hook-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type FormSelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type FormSelectProps = React.ComponentProps<typeof SelectPrimitive.Root> & {
  name: string;
  label?: React.ReactNode;
  description?: string;
  rules?: UseControllerProps['rules'];
  placeholder?: string;
  options: FormSelectOption[];
  className?: string;
};

export const FormSelect = ({
  name,
  label,
  description,
  rules,
  placeholder,
  options,
  className,
  disabled,
}: FormSelectProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled || field.disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
