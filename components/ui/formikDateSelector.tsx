// components\ui\formikDateSelector.tsx
'use client';

import React from 'react';
import { useField, useFormikContext } from 'formik';
import { DateInput, DateInputProps } from './dateInput'; 
import { FormikError } from './formikError';

interface FormikDateSelectorProps extends Omit<DateInputProps, 'date' | 'setFieldValue' | 'setFieldTouched'> {
  name: string;
}

export const FormikDateSelector: React.FC<FormikDateSelectorProps> = ({ name, ...rest }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field] = useField(name);

  return (
    <div className="space-y-1">
      <DateInput
        {...rest}
        date={field.value}
        setFieldValue={(fieldName: string, value: unknown, shouldValidate?: boolean) => setFieldValue(fieldName, value, shouldValidate)}
        setFieldTouched={(fieldName: string, isTouched?: boolean, shouldValidate?: boolean) => setFieldTouched(fieldName, isTouched, shouldValidate)}
        name={name}
      />
      <FormikError name={name} />
    </div>
  );
};
