// components\ui\FormikField.tsx
'use client';

import { useField } from 'formik';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormikError } from './formikError';

interface FormikFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  onInput?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const FormikField: React.FC<FormikFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  autoComplete = '',
  onInput = () => { },
  className = '',
  ...props
}) => {
  const [field, meta] = useField(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        {...field}
        {...props}
        id={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={meta.touched && !!meta.error}
        aria-describedby={`${name}-error`}
        onInput={onInput}
        className={className}
      />
      <FormikError name={name} />
    </div>
  );
};
