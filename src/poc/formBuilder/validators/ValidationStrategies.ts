export const Validators = {
  required: (value: any) =>
    value && value.trim() !== '' ? null : 'This field is required',

  minLength: (value: any, len: number) =>
    value?.length >= len ? null : `Minimum ${len} characters`,

  email: (value: any) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email',

  // Optional: Enforce strong password rules
  strongPassword: (value: any) =>
    /^(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)
      ? null
      : 'Password must contain uppercase and a number',

  aadhaar: (value: any) =>
    /^[2-9]{1}[0-9]{11}$/.test(value) ? null : 'Invalid Aadhaar number',
  vehicleReg: (value: any) =>
    /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(value.trim().toUpperCase())
      ? null
      : 'Invalid Vehicle Registration Number',
};
