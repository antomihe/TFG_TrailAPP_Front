// components\ui\formikProvinceSelector.tsx
'use client';

import React from 'react';
import { useField, useFormikContext } from 'formik';
import { FormikError } from './formikError';
import { ProvincesComponent, ProvincesComponentProps } from './provinceInput';

interface FormikProvinceSelectorProps extends Omit<
  ProvincesComponentProps,
  'provinceValue' | 'setFieldValue' | 'setFieldTouched'
> {
  name: string;
  locationFieldName: string; 
}

export const FormikProvinceSelector: React.FC<FormikProvinceSelectorProps> = ({
  name,
  locationFieldName,
  ...rest
}) => {
  const { setFieldValue, setFieldTouched, values } = useFormikContext<any>();
  const [field, meta] = useField(name);

  const hasError = meta.touched && !!meta.error;

  return (
    <div className="space-y-1">
      <ProvincesComponent
        {...rest}
        provinceValue={field.value}
        locationValue={values[locationFieldName]}
        setFieldValue={setFieldValue}
        setFieldTouched={setFieldTouched}
      />
      {hasError && <FormikError name={name} />}
    </div>
  );
};
