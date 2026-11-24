import { io, Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const connectSocket = (userId: string, token?: string): Socket => {
  const client = getSocket();
  if (token && (client.auth as { token?: string })?.token !== token) {
    client.auth = { token };
    if (client.connected) client.disconnect();
  }
  if (!client.connected) {
    client.connect();
  }
  client.emit('join-user', userId);
  return client;
};

export const disconnectSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const joinConversation = (conversationId: string): void => {
  getSocket().emit('join-conversation', conversationId);
};

export const leaveConversation = (conversationId: string): void => {
  getSocket().emit('leave-conversation', conversationId);
};

export const emitTyping = (
  conversationId: string,
  userId: string,
  isTyping: boolean
): void => {
  getSocket().emit('typing', { conversationId, userId, isTyping });
};

export default getSocket;
