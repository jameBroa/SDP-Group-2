{/* 
    Configures the authentication for the app.
*/}

import { getAuth } from 'firebase/auth';
import app from './firebase';

const auth = getAuth(app);

export default auth;
