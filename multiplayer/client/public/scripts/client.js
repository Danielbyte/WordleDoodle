import { PORT } from '../../../../config/env';
import { io } from 'socket.io-client'

const SERVER_URL = PORT !== '.env.development.local' ? 'https://wordleDoodle.com' : PORT; //if not development, default to production => app link


//Instantiate client side socket
const socket = io(SERVER_URL, {
  withCredentials: true
});