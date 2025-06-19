// components\ui\formikButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';
import { useFormikContext } from 'formik';
import { clsx } from 'clsx';

interface FormikButtonProps {
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  sendingText?: string;
}

export const FormikButton: React.FC<FormikButtonProps> = ({
  children = 'Enviar',
  className = '',
  fullWidth = true,
  type = 'submit',
  disabled = false,
  sendingText = 'Enviando...',
}) => {
  const { isSubmitting } = useFormikContext();

  const isButtonDisabled = isSubmitting || disabled;

  return (
    <Button
      type={type}
      disabled={isButtonDisabled}
      className={clsx(
        fullWidth && 'w-full',
        className
      )}
    >
      {disabled ? (
        <span className="">{children}</span>
      ) : isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {sendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};
