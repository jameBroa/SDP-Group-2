import { fireEvent } from '@testing-library/react';
import Utils from '../utils';
import Register from '../../../app/register';
import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';


describe('Firebase Registration', () => {
  beforeAll(async () => {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://intelliputt-2024-default-rtdb.europe-west1.firebasedatabase.app"
    });
  });

  it('should register a valid user to Firebase', async () => {
    // part 1) simulate the user filling out the form
    const validEmail = Utils.generateValidEmail();
    const validPassword = Utils.generateValidPassword();
    const validExperienceLevel = Utils.getValidExperienceLevel();
    const validName = Utils.generateValidName();

    // render the Register component
    const { getByPlaceholderText } = render(Register);

    // create using our function
    fireEvent.change(getByPlaceholderText('Name'), { target: { value: validName } });
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: validEmail } });
    fireEvent.change(getByPlaceholderText('Password'), { target: { value: validPassword } });

    // simulate the click event on the found Chip
    fireEvent.click(screen.getByText(validExperienceLevel));

    // part 2) create user
    fireEvent.click(screen.getByText('Register'));

    // part 3) check if user exists in Firebase
    const user = await admin.auth().getUserByEmail(validEmail);
    expect(user).toBeTruthy();
  });
});