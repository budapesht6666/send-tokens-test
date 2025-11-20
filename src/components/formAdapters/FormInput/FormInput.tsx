'use client';

import * as React from 'react';
import { useFormContext, type UseControllerProps } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export type FormInputProps = React.ComponentProps<typeof Input> & {
  name: string;
  label?: React.ReactNode;
  description?: string;
  rules?: UseControllerProps['rules'];
};

export const FormInput: React.FC<FormInputProps> = (props) => {
  const { name, label, description, rules, ...restProps } = props;
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input {...field} {...restProps} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
