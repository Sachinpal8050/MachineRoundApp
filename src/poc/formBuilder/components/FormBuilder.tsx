import React from 'react';
import FieldFactory from '../factories/FieldFactory';

export default function FormBuilder({
  schema,
  formState,
  onChange,
  onBlur,
  errors,
}: {
  schema: any;
  formState: any;
  onChange: (name: string, value: string) => void;
  onBlur: () => void;
  errors: any;
}) {
  return (
    <>
      {schema.map((field: any) =>
        FieldFactory.createField(field, formState, onChange, onBlur, errors),
      )}
    </>
  );
}
