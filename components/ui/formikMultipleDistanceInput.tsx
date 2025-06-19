// components\ui\formikMultipleDistanceInput.tsx
'use client';

import React from 'react';
import { useField, useFormikContext } from 'formik';
import { MultipleDistanceInput } from './multiple-distance-input';
import { FormikError } from './formikError';

interface FormikMultipleDistanceInputProps {
  name: string;
  label?: string;
}

export const FormikMultipleDistanceInput: React.FC<FormikMultipleDistanceInputProps> = ({ name, label }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext<any>();
  const [field] = useField(name);

  return (
    <div className="space-y-1">
      <MultipleDistanceInput
        name={name}
        value={field.value || []}
        onChange={(val) => setFieldValue(name, val)}
        onBlur={() => setFieldTouched(name, true)}
        label={label}
      />
      <FormikError name={name} />
    </div>
  );
};
