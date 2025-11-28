'use client';

import * as React from 'react';
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

export type FormSelectProps = {
  name: string;
  label?: React.ReactNode;
  description?: string;
  rules?: UseControllerProps['rules'];
  placeholder?: string;
  options: FormSelectOption[];
  className?: string;
};

export const FormSelect: React.FC<FormSelectProps> = (props) => {
  const { name, label, description, rules, placeholder, options, className } = props;
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
            <Select value={field.value} onValueChange={field.onChange} disabled={field.disabled}>
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
