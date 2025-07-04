import React from 'react';
import TextInputField from '../components/fields/TextInputField';
import PasswordInputField from '../components/fields/PasswordField';
import AadhaarInputField from '../components/fields/AddharField';

export default class FieldFactory {
  static createField(
    fieldConfig: any,
    formState: any,
    onChange: (name: string, value: string) => void,
    onBlur: () => void,
    errors: any,
  ) {
    switch (fieldConfig.type) {
      case 'text':
        return (
          <TextInputField
            key={fieldConfig.name}
            config={fieldConfig}
            value={formState[fieldConfig.name]}
            onChange={onChange}
            error={errors[fieldConfig.name]}
            onBlur={onBlur}
          />
        );
      case 'password':
        return (
          <PasswordInputField
            key={fieldConfig.name}
            config={fieldConfig}
            value={formState[fieldConfig.name]}
            onChange={onChange}
            error={errors[fieldConfig.name]}
            onBlur={onBlur}
          />
        );
      case 'aadhaar':
        return (
          <AadhaarInputField
            key={fieldConfig.name}
            config={fieldConfig}
            value={formState[fieldConfig.name]}
            onChange={onChange}
            error={errors[fieldConfig.name]}
            onBlur={onBlur}
          />
        );
    }
  }
}
