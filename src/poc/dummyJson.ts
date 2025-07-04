export const SCHEMA = [
  {
    type: 'text',
    name: 'email',
    label: 'Email',
    required: true,
    validation: {
      type: 'email',
    },
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    required: true,
    validation: {
      minLength: 6,
      custom: 'strongPassword',
    },
  },
  {
    type: 'text',
    name: 'aadhaar',
    label: 'Aadhaar Number',
    required: true,
    validation: {
      custom: 'aadhaar',
    },
  },
  {
    type: 'text',
    name: 'vehicleReg',
    label: 'Vehicle Registration Number',
    required: true,
    validation: {
      custom: 'vehicleReg',
    },
  },
];
