// components\ui\formikError.tsx
'use client';
import { useFormikContext, getIn } from "formik";
import { Small } from "./typography";
import { AlertCircle } from "lucide-react";

type Props = {
  name: string;
};

export function FormikError({ name }: Props) {
  const { errors, touched } = useFormikContext<any>();
  const error = getIn(errors, name);
  const isTouched = getIn(touched, name);

  if (!isTouched || !error) return null;

  return (
    <Small className="flex items-center mt-1.5 text-destructive" id={`${name}-error`}>
      <AlertCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
      {error}
    </Small>
  );
}
