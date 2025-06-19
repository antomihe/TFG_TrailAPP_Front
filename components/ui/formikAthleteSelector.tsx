// components\ui\formikAthleteSelector.tsx
'use client';

import React from 'react';
import { useField, useFormikContext } from 'formik';
import { AthleteSelector, AthleteSelectorProps } from './athleteSelector';
import { FormikError } from './formikError';

interface FormikAthleteSelectorProps extends Omit<AthleteSelectorProps, 'selectedValue' | 'onSelect'> {
  name: string;
}

export const FormikAthleteSelector: React.FC<FormikAthleteSelectorProps> = ({ name, ...rest }) => {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const [field, meta] = useField(name);

  const hasError = meta.touched && !!meta.error;

  return (
    <div className="space-y-1">
      <AthleteSelector
        {...rest}
        selectedValue={field.value}
        onSelect={(athleteId) => setFieldValue(name, athleteId)}
        setFieldTouched={(fieldName, isTouched, shouldValidate) => setFieldTouched(fieldName, isTouched, shouldValidate)}
      />
      <FormikError name={name} />
    </div>
  );
};
