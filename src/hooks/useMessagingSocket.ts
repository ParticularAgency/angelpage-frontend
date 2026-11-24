'use client';

import { useEffect, useCallback } from 'react';
import {
  connectSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  emitTyping,
  getSocket,
} from '@/utils/socketClient';

interface MessagePayload {
  conversationId: string;
  message: Record<string, unknown>;
}

interface UseMessagingSocketOptions {
  userId?: string;
  token?: string;
  conversationId?: string;
  onNewMessage?: (payload: MessagePayload) => void;
  onConversationUpdated?: (payload: Record<string, unknown>) => void;
  onMessagesRead?: (payload: Record<string, unknown>) => void;
  onUserTyping?: (payload: Record<string, unknown>) => void;
}

export const useMessagingSocket = ({
  userId,
  token,
  conversationId,
  onNewMessage,
  onConversationUpdated,
  onMessagesRead,
  onUserTyping,
}: UseMessagingSocketOptions) => {
  useEffect(() => {
    if (!userId) return;

    const socket = connectSocket(userId, token);

    return () => {
      if (conversationId) {
        leaveConversation(conversationId);
      }
    };
  }, [userId, token, conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    joinConversation(conversationId);

    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = (payload: MessagePayload) => {
      onNewMessage?.(payload);
    };

    const handleConversationUpdated = (payload: Record<string, unknown>) => {
      onConversationUpdated?.(payload);
    };

    const handleMessagesRead = (payload: Record<string, unknown>) => {
      onMessagesRead?.(payload);
    };

    const handleUserTyping = (payload: Record<string, unknown>) => {
      onUserTyping?.(payload);
    };

    socket.on('new-message', handleNewMessage);
    socket.on('conversation-updated', handleConversationUpdated);
    socket.on('messages-read', handleMessagesRead);
    socket.on('user-typing', handleUserTyping);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('conversation-updated', handleConversationUpdated);
      socket.off('messages-read', handleMessagesRead);
      socket.off('user-typing', handleUserTyping);
    };
  }, [onNewMessage, onConversationUpdated, onMessagesRead, onUserTyping]);

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (userId && conversationId) {
        emitTyping(conversationId, userId, isTyping);
      }
    },
    [userId, conversationId]
  );

  return { sendTyping };
};

export default useMessagingSocket;
