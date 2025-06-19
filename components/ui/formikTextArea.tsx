// components\ui\formikTextArea.tsx
'use client';

import { useField } from 'formik';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TextareaHTMLAttributes } from 'react';
import { FormikError } from './formikError';

interface FormikTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  className?: string;
}

export const FormikTextArea: React.FC<FormikTextAreaProps> = ({
  name,
  label,
  placeholder = '',
  autoComplete = '',
  className = '',
  rows = 4,
  ...props
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && !!meta.error;

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        {...field}
        id={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={`${name}-error`}
        rows={rows}
        className={className}
        {...props}
      />
      <FormikError name={name} />
    </div>
  );
};
