'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import useMessagingSocket from '@/hooks/useMessagingSocket';
import StatusBadge from '@/components/dashboard/StatusBadge';

const formatMessageTime = (dateString) => {
  const messageDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return messageDate.toLocaleString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
};

const getDisplayName = (participant) => {
  if (!participant) return 'Unknown';
  return participant.charityName || participant.firstName || participant.userName || 'User';
};

const ConversationPage = ({ embedded = false }) => {
  const { data: session } = useSession();
  const params = useParams();
  const routeConversationId = params?.conversationId;
  const [embeddedConversationId, setEmbeddedConversationId] = useState(null);
  const conversationId = embedded ? embeddedConversationId : routeConversationId;
  const router = useRouter();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleNewMessage = useCallback((payload) => {
    if (payload.conversationId !== conversationId) return;
    setMessages((prev) => {
      if (prev.some((m) => m._id === payload.message._id)) return prev;
      return [...prev, payload.message];
    });
    if (payload.message.sender?._id !== session?.user?.id) {
      markMessagesAsRead([payload.message._id]);
    }
  }, [conversationId, session?.user?.id]);

  const handleConversationUpdated = useCallback(() => {
    if (session?.user?.id) fetchConversations();
  }, [session?.user?.id]);

  const handleUserTyping = useCallback((payload) => {
    if (payload.conversationId === conversationId && payload.userId !== session?.user?.id) {
      setIsTyping(payload.isTyping);
    }
  }, [conversationId, session?.user?.id]);

  const { sendTyping } = useMessagingSocket({
    userId: session?.user?.id,
    token: session?.token,
    conversationId,
    onNewMessage: handleNewMessage,
    onConversationUpdated: handleConversationUpdated,
    onUserTyping: handleUserTyping,
  });

  useEffect(() => {
    if (session?.user?.id && session?.user?.role) {
      axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/message/user/${session.user.id}/${session.user.role}`,
        { headers: { Authorization: `Bearer ${session.token}` } }
      ).then((r) => setUserDetails(r?.data?.user)).catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id) fetchConversations();
  }, [session?.user?.id]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/message/messages/recipient/${session.user.id}`,
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      setConversations(response?.data?.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    if (conversationId && session?.token) fetchConversationDetails();
  }, [conversationId, session?.token]);

  const fetchConversationDetails = async () => {
    if (!session?.token) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/message/conversations/${conversationId}`,
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      const { conversation, messages: messagesData } = response.data;
      setMessages(messagesData || []);
      setActiveConversation(conversation);

      const other = conversation.participants?.find(
        (p) => p.participantId?.toString() !== session.user.id?.toString()
      );
      if (other) {
        const detailsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/message/user/${other.participantId}/${other.participantType}`,
          { headers: { Authorization: `Bearer ${session.token}` } }
        ).catch(() => null);
        setOtherParticipant(detailsRes?.data?.user || other);
      }
      await markMessagesAsRead(messagesData?.filter((m) => m.status === 'unread').map((m) => m._id));
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (messageIds = []) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/message/messages/mark-as-read`,
        { conversationId, messageIds },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
    } catch (error) {
      console.error('Error marking read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!session?.token || !newMessage.trim() || !otherParticipant || sending) return;
    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);
    sendTyping(false);
    try {
      const recipientId = otherParticipant.participantId || otherParticipant._id;
      const recipientType = otherParticipant.participantType || (otherParticipant.role === 'CHARITY' ? 'CHARITY' : 'USER');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/message/messages/send`,
        {
          conversationId,
          senderId: session.user.id,
          senderType: session.user.role === 'USER' ? 'User' : 'Charity',
          recipientId,
          recipientType: recipientType === 'CHARITY' ? 'Charity' : 'User',
          content,
        },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      const sentMessage = response.data.data;
      if (sentMessage) {
        setMessages((prev) => prev.some((m) => m._id === sentMessage._id) ? prev : [...prev, sentMessage]);
      }
      fetchConversations();
    } catch (error) {
      setNewMessage(content);
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    sendTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping(false), 1500);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = getDisplayName(c.otherParticipant).toLowerCase();
    const preview = (c.lastMessage?.content || '').toLowerCase();
    return name.includes(q) || preview.includes(q);
  });

  const groupMessagesByDate = (msgs) => {
    const groups = [];
    msgs.forEach((message) => {
      const d = new Date(message.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      let label = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      if (d.toDateString() === today.toDateString()) label = 'Today';
      else if (d.toDateString() === yesterday.toDateString()) label = 'Yesterday';
      if (!groups.some((g) => g.date === label)) groups.push({ date: label, messages: [] });
      groups.find((g) => g.date === label).messages.push(message);
    });
    return groups;
  };

  const openConversation = (id) => {
    if (embedded) {
      setEmbeddedConversationId(id);
    } else {
      router.push(`/messaging/chat/${id}`);
    }
  };

  const productInfo = activeConversation?.productSnapshot || activeConversation?.productId;
  const groupedMessages = groupMessagesByDate(messages);
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className={embedded ? 'py-2' : 'min-h-[calc(100vh-120px)] bg-[#F6F8FA] py-6 sm:py-8'}>
      <div className={embedded ? '' : 'custom-container'}>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Image
              src={userDetails?.profileImage || '/images/icons/elisp-profile-default-img.svg'}
              alt=""
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#611192]/20"
            />
            <div>
              <h1 className="h5 font-primary text-mono-100">Messages</h1>
              <p className="caption text-mono-70">
                {userDetails?.firstName || userDetails?.charityName || 'Your inbox'}
                {totalUnread > 0 && (
                  <span className="ml-2 text-[#611192] font-semibold">
                    · {totalUnread} unread
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Main messaging shell */}
        <div className="grid grid-cols-12 gap-0 rounded-2xl overflow-hidden border border-[#E6E3E7] shadow-lg bg-white min-h-[70vh]">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-4 lg:col-span-4 border-r border-[#E6E3E7] flex flex-col bg-white">
            <div className="p-4 bg-linear-to-r from-[#611192] to-[#8B3AB8]">
              <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">Inbox</p>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/15 backdrop-blur-sm text-white placeholder:text-white/60 text-sm border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-white/30"
                />
                <Image src="/images/search.svg" alt="" width={16} height={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 invert" />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[calc(70vh-80px)]">
              {filteredConversations.length === 0 ? (
                <li className="text-center py-12 px-4">
                  <p className="body-small text-mono-70">No conversations yet</p>
                  <p className="caption text-mono-70 mt-1">Message a seller from any product page</p>
                </li>
              ) : (
                filteredConversations.map((conversation) => {
                  const isActive = conversation.conversationId === conversationId;
                  const hasUnread = conversation.unreadCount > 0;
                  const other = conversation.otherParticipant;
                  return (
                    <li key={conversation.conversationId}>
                      <button
                        type="button"
                        onClick={() => openConversation(conversation.conversationId)}
                        className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-[#F2E8F8] border border-[#611192]/20'
                            : 'hover:bg-[#F6F8FA] border border-transparent'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <Image
                            src={other?.profileImage || '/images/icons/elisp-profile-default-img.svg'}
                            alt=""
                            width={44}
                            height={44}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                          {hasUnread && (
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#611192] rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`forms-bold text-sm truncate ${hasUnread ? 'text-mono-100' : 'text-mono-90'}`}>
                              {getDisplayName(other)}
                            </p>
                            <span className="caption text-mono-70 shrink-0">
                              {conversation.lastMessage?.createdAt
                                ? formatMessageTime(conversation.lastMessage.createdAt)
                                : ''}
                            </span>
                          </div>
                          {conversation.productSnapshot?.name && (
                            <p className="caption text-[#611192] truncate mt-0.5">
                              Re: {conversation.productSnapshot.name}
                            </p>
                          )}
                          <p className={`caption truncate mt-0.5 ${hasUnread ? 'text-mono-100 font-medium' : 'text-mono-70'}`}>
                            {conversation.lastMessage?.content || 'Start chatting'}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Chat panel */}
          <div className="col-span-12 md:col-span-8 lg:col-span-8 flex flex-col min-h-[70vh]">
            {!conversationId ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-linear-to-b from-[#F2E8F8]/30 to-white">
                <div className="w-16 h-16 rounded-2xl bg-[#F2E8F8] flex items-center justify-center mb-4">
                  <Image src="/images/logo-message.svg" alt="" width={48} height={32} />
                </div>
                <h3 className="body-bold-medium text-mono-100 mb-2">Select a conversation</h3>
                <p className="body-small text-mono-70 max-w-sm">
                  Choose a thread from the left or start one from a product page to ask about an item.
                </p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="px-5 py-4 border-b border-[#E6E3E7] bg-white flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Image
                      src={otherParticipant?.profileImage || '/images/icons/elisp-profile-default-img.svg'}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="forms-bold text-mono-100 truncate">
                        {getDisplayName(otherParticipant)}
                      </p>
                      {isTyping ? (
                        <p className="caption text-[#611192] animate-pulse">typing...</p>
                      ) : (
                        <p className="caption text-mono-70">Active now</p>
                      )}
                    </div>
                  </div>
                  {productInfo?.name && (
                    <Link
                      href={`/product/${activeConversation?.productId?.slug || activeConversation?.productSnapshot?.slug || activeConversation?.productId?._id || activeConversation?.productId}`}
                      className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F2E8F8] hover:bg-[#611192]/10 transition-colors shrink-0"
                    >
                      {productInfo.imageUrl && (
                        <Image src={productInfo.imageUrl} alt="" width={32} height={32} className="w-8 h-8 rounded-lg object-cover" />
                      )}
                      <div className="text-left">
                        <p className="caption text-mono-100 font-semibold truncate max-w-[120px]">{productInfo.name}</p>
                        {productInfo.price != null && (
                          <p className="text-[10px] text-[#611192] font-bold">£{productInfo.price}</p>
                        )}
                      </div>
                    </Link>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#FAFAFB]">
                  {loading && messages.length === 0 ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
                          <div className="h-14 w-48 bg-mono-40/50 rounded-2xl animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="body-small text-mono-70">No messages yet</p>
                      <p className="caption text-mono-70 mt-1">Say hello and ask about the product</p>
                    </div>
                  ) : (
                    groupedMessages.map((group) => (
                      <div key={group.date}>
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-[#E6E3E7]" />
                          <span className="caption text-mono-70 uppercase tracking-wide text-[10px] font-semibold">
                            {group.date}
                          </span>
                          <div className="flex-1 h-px bg-[#E6E3E7]" />
                        </div>
                        {group.messages.map((message) => {
                          const isOwn = message?.sender?._id === session?.user?.id;
                          return (
                            <div key={message._id} className={`flex mb-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                <div
                                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                    isOwn
                                      ? 'bg-[#611192] text-white rounded-br-md'
                                      : 'bg-white text-mono-100 border border-[#E6E3E7] rounded-bl-md shadow-xs'
                                  }`}
                                >
                                  {message.content}
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                  <span className="text-[10px] text-mono-70">
                                    {formatMessageTime(message.createdAt)}
                                  </span>
                                  {isOwn && message.status && (
                                    <StatusBadge status={message.status} size="sm" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-[#E6E3E7] bg-white">
                  <div className="flex items-center gap-2 rounded-2xl bg-[#F6F8FA] border border-[#E6E3E7] px-4 py-2 focus-within:border-[#611192]/40 focus-within:ring-2 focus-within:ring-[#611192]/10 transition-all">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleInputChange}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      placeholder="Write your message..."
                      disabled={sending}
                      className="flex-1 bg-transparent body-small text-mono-100 placeholder:text-mono-70 focus:outline-hidden h-10"
                    />
                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="w-10 h-10 rounded-xl bg-[#611192] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#3B055C] transition-colors shrink-0"
                    >
                      <Image src="/images/Send.svg" alt="Send" width={17} height={18} className="invert" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
