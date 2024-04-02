import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://172.24.42.106:5000";

export const socket = io(URL);