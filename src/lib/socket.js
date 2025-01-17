import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://backend-22cx.onrender.com/" //"http://localhost:5000";
const socket = io(SOCKET_SERVER_URL);

export default socket;