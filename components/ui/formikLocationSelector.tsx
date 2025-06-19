// components\ui\formikLocationSelector.tsx
'use client';

import React from 'react';
import { useField, useFormikContext } from 'formik';
import { LocationComponent, LocationComponentProps } from './locationInput';
import { FormikError } from './formikError';

interface FormikLocationSelectorProps extends Omit<
    LocationComponentProps,
    'locationValue' | 'setFieldValue' | 'setFieldTouched' | 'province' | 'disabled'
> {
    name: string;
    provinceFieldName: string;
    disabled?: boolean;
}

export const FormikLocationSelector: React.FC<FormikLocationSelectorProps> = ({
    name,
    provinceFieldName,
    disabled,
    ...rest
}) => {
    const { values, setFieldValue, setFieldTouched } = useFormikContext<any>();
    const [field] = useField(name);

    const province = values[provinceFieldName];

    return (
        <div className="space-y-1">
            <LocationComponent
                {...rest}
                province={province}
                locationValue={field.value}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                disabled={disabled ?? !province}
            />
             <FormikError name={name} />
        </div>
    );
};
