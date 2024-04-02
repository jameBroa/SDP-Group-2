import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://172.24.40.199:5000";

export const socket = io(URL);