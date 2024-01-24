import { getDatabase } from 'firebase/database';
import app from './firebase';

const db = getDatabase(app);

export default db;
