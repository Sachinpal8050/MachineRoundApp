import {Validators} from '../validators/ValidationStrategies';

export function validateField(field: any, value: any) {
  let error = null;
  if (field.required) {
    error = Validators.required(value);
    if (error) {
      return error;
    }
  }

  if (field.validation?.minLength) {
    error = Validators.minLength(value, field.validation.minLength);
    if (error) {
      return error;
    }
  }

  if (field.validation?.type === 'email') {
    error = Validators.email(value);
  }

  if (field.validation?.custom && Validators[field.validation.custom]) {
    error = Validators[field.validation.custom](value);
    if (error) return error;
  }

  return error;
}
