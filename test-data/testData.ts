import type { RegistrationDetails } from '../pages/RegisterPage';

export const testData = {
  registration: {
    firstName: 'Alice',
    lastName: 'Doe',
    dateOfBirth: '1999-01-01',
    country: 'JP',
    postalCode: '1000001',
    houseNumber: '42',
    state: 'Tokyo',
    phone: '9999999999',
    email: 'testdata@test.com',
    password: 'TestData@12345',
  } satisfies RegistrationDetails,
  invalidAccount: {
    email: 'invalid@test.com',
    password: 'invalid',
  },
  cart: {
    productName: 'Hammer',
    retainedProductName: 'Claw Hammer',
  },
};
