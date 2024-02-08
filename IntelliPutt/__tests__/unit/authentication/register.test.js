import { registerToFirebase } from '../src/firebase'; // Assuming you have a separate file for Firebase functions


describe('Firebase Registration', () => {
  it('should register a new user to Firebase', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    // Mock the Firebase registration function
    const mockRegister = jest.fn(() => Promise.resolve({ uid: '123' }));
    jest.mock('../src/firebase', () => ({
      registerToFirebase: mockRegister,
    }));

    // Call the registration function
    const result = await registerToFirebase(email, password);

    // Assert that the registration function was called with the correct arguments
    expect(mockRegister).toHaveBeenCalledWith(email, password);

    // Assert that the registration function returned the expected result
    expect(result).toEqual({ uid: '123' });
  });
});