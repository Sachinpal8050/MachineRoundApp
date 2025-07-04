// screens/DynamicFormScreen.tsx
import React, {useState} from 'react';
import FormBuilder from '../components/FormBuilder';
import {validateField} from '../utils/validateField';
import {Button} from 'react-native';
import {SCHEMA} from '../../dummyJson';

const schema = SCHEMA;

export default function DynamicFormScreen() {
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});

  const onChange = (name: any, value: any) => {
    setFormState({...formState, [name]: value});
    if (errors[name]) {
      const field = schema.find(f => f.name === name);
      const error = validateField(field, value);
      setErrors(prev => ({...prev, [name]: error}));
    }
  };

  const onSubmit = () => {
    const newErrors = {};
    schema.forEach((field: any) => {
      const error = validateField(field, formState[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Submit the form
      console.log('Submitted:', formState);
    }
  };

  const onBlur = (field: any) => {
    const error = validateField(field, formState[field.name] || '');
    setErrors(prev => ({...prev, [field.name]: error}));
  };

  return (
    <>
      <FormBuilder
        schema={schema}
        formState={formState}
        onChange={onChange}
        errors={errors}
        onBlur={onBlur}
      />
      <Button title="Submit" onPress={onSubmit} />
    </>
  );
}
