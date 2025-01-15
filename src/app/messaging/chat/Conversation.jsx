'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use next/navigation to control routing
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';
// import { DeleteIcon } from '@/icons';
import Image from 'next/image';
// import Link from 'next/link';
// import BannerSection from './Banner';

// Helper function for time formatting
const formatMessageTime = (dateString) => {
  const messageDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (messageDate.toDateString() === today.toDateString()) {
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  }

  return messageDate.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ConversationPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const conversationId = params?.conversationId; // Explicitly cast to string
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (session?.user?.id && session?.user?.role) {
      fetchUserDetails(session.user.id, session.user.role); // Pass role from session
    }
  }, [session]);

  const fetchUserDetails = async (userId, role) => {
    setLoading(true);
    try {
      console.log('userId:', userId, 'role:', role);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/message/user/${userId}/${role}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      console.log('Fetched user details:', response?.data?.user);
      setUserDetails(response?.data?.user);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchConversations();
    }
  }, [session?.user?.id]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/message/messages/recipient/${session.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      console.log(response?.data?.conversations);
      setConversations(response?.data?.conversations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conversationId && session?.token) {
      fetchConversationDetails();
    }
  }, [conversationId, session]);

  const fetchConversationDetails = async () => {
    if (!session?.token) {
      console.error('User is not authenticated.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/message/conversations/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      const { conversation, messages: messagesData } = response.data;

      // Mark messages as 'read'
      messagesData.forEach(msg => {
        msg.status = 'read';
      });

      setMessages(messagesData);

      const participants = conversation.participants || [];
      const currentUserId = session.user.id;

      const otherParticipantInfo = participants.find(
        participant => participant.participantId !== currentUserId
      );

      if (otherParticipantInfo) {
        setOtherParticipant(otherParticipantInfo);
      } else {
        console.error('Other participant not found.');
      }
      // Mark messages as read in the backend
      await markMessagesAsRead(messagesData);
    } catch (error) {
      console.error('Error fetching conversation details:', error);
    } finally {
      setLoading(false);
    }
  };
  // Mark all messages in the current conversation as read
  const markMessagesAsRead = async messagesData => {
    try {
      const messageIds = messagesData.map(msg => msg._id);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/message/messages/mark-as-read`,
        { messageIds },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };
  const handleSendMessage = async () => {
    if (!session?.token || !newMessage.trim() || !otherParticipant) {
      console.error('Missing required fields for sending a message.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/message/messages/send`,
        {
          conversationId,
          senderId: session.user.id,
          senderType: session.user.role === 'USER' ? 'User' : 'Charity',
          recipientId: otherParticipant.participantId,
          recipientType:
            otherParticipant.participantType === 'USER' ? 'User' : 'Charity',
          content: newMessage,
          status: 'unread',
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      // Add new message to the conversation without re-fetching messages
      setMessages(prevMessages => [...prevMessages, response.data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  // Function to filter conversations based on search query
  const filterConversations = () => {
    return conversations.filter(conversation => {
      const searchLower = searchQuery.toLowerCase();

      return (
        (
          conversation?.lastMessage?.sender?.firstName?.toLowerCase() || ''
        ).includes(searchLower) ||
        (
          conversation?.lastMessage?.sender?.lastName?.toLowerCase() || ''
        ).includes(searchLower) ||
        (
          conversation?.lastMessage?.sender?.userName?.toLowerCase() || ''
        ).includes(searchLower) ||
        (
          conversation?.lastMessage?.sender?.charityName?.toLowerCase() || ''
        ).includes(searchLower) ||
        (
          conversation?.lastMessage?.recipient?.firstName?.toLowerCase() || ''
        ).includes(searchLower) ||
        (
          conversation?.lastMessage?.recipient?.lastName?.toLowerCase() || ''
        ).includes(searchLower) ||
        (
          conversation?.lastMessage?.recipient?.userName?.toLowerCase() || ''
        ).includes(searchLower) ||
        (
          conversation?.lastMessage?.recipient?.charityName?.toLowerCase() || ''
        ).includes(searchLower)
      );
    });
  };

  // Function to format the date and group messages
  const groupMessagesByDate = messages => {
    const groupedMessages = [];

    messages.forEach(message => {
      const messageDate = new Date(message.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let dateLabel = '';

      if (messageDate.toDateString() === today.toDateString()) {
        dateLabel = 'TODAY';
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        dateLabel = 'YESTERDAY';
      } else {
        dateLabel = messageDate.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        });
      }

      if (!groupedMessages.some(group => group.date === dateLabel)) {
        groupedMessages.push({ date: dateLabel, messages: [] });
      }

      const group = groupedMessages.find(group => group.date === dateLabel);
      group.messages.push(message);
    });

    return groupedMessages;
  };

  // Handle selecting a conversation from the list
  const handleConversationClick = conversationId => {
    setSelectedConversationId(conversationId); // Update selected conversation
    router.push(`/messaging/chat/${conversationId}`); // Update the URL without reloading
    fetchConversationDetails(); // Fetch new messages based on selected conversation
  };

  const groupedMessages = groupMessagesByDate(messages);
  const filteredConversations = filterConversations();
 
  return (
    <>
      <div className="message-main-wrapper">
        <div className="message-banner-area">
          <section className="users-account-banner-section relative py-10 sm:pb-8">
            <div className="custom-container">
              <div className="users-account-banner-wrapper  flex items-center justify-between sm:flex-col sm:items-start sm:gap-8">
                <div className="users-account-left-cont flex items-center gap-4">
                  {userDetails ? (
                    <Image
                      src={
                        userDetails?.profileImage ||
                        '/images/icons/elisp-profile-default-img.svg'
                      }
                      alt="user profile image"
                      className="rounded-full w-10 h-10 object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="skeleton bg-mono-40 h-10 w-10 shrink-0 rounded-full"></div>
                  )}

                  <div className="users-info-cont">
                    <h1 className="h5 sm:text-[17px]  font-primary user-profile-name whitespace-nowrap text-mono-100 mb-[2px]">
                      {userDetails ? (
                        <>
                          {' '}
                          {userDetails?.firstName || userDetails?.charityName}
                        </>
                      ) : (
                        <span className="skeleton bg-mono-40 block  h-2 w-20 shrink-0 rounded-full"></span>
                      )}
                    </h1>
                    <p className="user-username body-small">
                      {' '}
                      {userDetails ? (
                        <> {userDetails?.userName || 'username'}</>
                      ) : (
                        <span className="skeleton bg-mono-40 block  h-2 w-20 shrink-0 rounded-full"></span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="message-content-area pb-20">
          <div className="custom-container">
            <div className="message-area-wrapper pt-10 grid grid-cols-12 gap-6">
              {/* Left panel: Conversation List */}
              <div className="message-left-area sticky h-[60vh] overflow-hidden col-span-5 sm:col-span-full">
                <div className="conversation-list-header pt-[15px]">
                  <div className="converation-title-box flex justify-between items-center mb-4">
                    <h2 className="eyebrow-large font-secondary text-mono-100 uppercase">
                      Inbox
                    </h2>
                    {/* <Image
                      src="/images/edit-squer-icon.svg"
                      alt="edit icons"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    /> */}
                  </div>
                  <div className="converation-search-box mb-4">
                    <label className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by name or username"
                        className="pl-10 h-9 !bg-[#F6F8FA] w-full text-mono-100 placeholder:!text-[#CDD3DA] body-bold-small"
                      />
                      <span className="search-icon absolute top-1 left-4 bottom-0 my-auto">
                        <Image
                          src="/images/search.svg"
                          alt="search icons"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                      </span>
                    </label>
                  </div>
                  <div className="filter-sorting-area"></div>
                </div>

                <ul className="conversation-lists pr-3 overflow-hidden h-[460px] overflow-y-scroll">
                  {loading ? (
                    <>
                      <li className="conversation-list-item flex justify-between items-center hover:bg-[#F1F1F7] cursor-pointer h-[72px] py-2 pl-[17px] pr-[10px] mb-2">
                        <div className="conversation-item-cont flex gap-[27px] items-center">
                          <div className="user-image">
                            <div className="skeleton bg-mono-40 h-10 w-10 shrink-0 rounded-full"></div>
                          </div>
                          <div className="user-info">
                            <p className="name forms-bold text-mono-100">
                              <span className="skeleton bg-mono-40 block  h-2 w-20 shrink-0 rounded-full"></span>
                            </p>
                            <p className="content forms-bold mt-2">
                              <span className="skeleton bg-mono-40 block  h-2 w-20 shrink-0 rounded-full"></span>
                            </p>
                          </div>
                        </div>
                        <div className="right-states-area">
                          <p className="data-titme-latest-message forms-bold text-mono-50">
                            <span className="skeleton bg-mono-40 block  h-2 w-8  shrink-0 rounded-full"></span>
                          </p>
                        </div>
                      </li>
                      <li className="conversation-list-item flex justify-between items-center hover:bg-[#F1F1F7] cursor-pointer h-[72px] py-2 pl-[17px] pr-[10px] mb-2">
                        <div className="conversation-item-cont flex gap-[27px] items-center">
                          <div className="user-image">
                            <div className="skeleton bg-mono-40 h-10 w-10 shrink-0 rounded-full"></div>
                          </div>
                          <div className="user-info">
                            <p className="name forms-bold text-mono-100">
                              <span className="skeleton bg-mono-40 block  h-2 w-20 shrink-0 rounded-full"></span>
                            </p>
                            <p className="content forms-bold mt-2">
                              <span className="skeleton bg-mono-40 block  h-2 w-20 shrink-0 rounded-full"></span>
                            </p>
                          </div>
                        </div>
                        <div className="right-states-area">
                          <p className="data-titme-latest-message forms-bold text-mono-50">
                            <span className="skeleton bg-mono-40 block  h-2 w-8 shrink-0 rounded-full"></span>
                          </p>
                        </div>
                      </li>
                      <li className="conversation-list-item flex justify-between items-center hover:bg-[#F1F1F7] cursor-pointer h-[72px] py-2 pl-[17px] pr-[10px] mb-2">
                        <div className="conversation-item-cont flex gap-[27px] items-center">
                          <div className="user-image">
                            <div className="skeleton bg-mono-40 h-10 w-10 shrink-0 rounded-full"></div>
                          </div>
                          <div className="user-info">
                            <p className="name forms-bold text-mono-100">
                              <span className="skeleton bg-mono-40 block  h-2 w-20 shrink-0 rounded-full"></span>
                            </p>
                            <p className="content forms-bold mt-2">
                              <span className="skeleton bg-mono-40 block  h-2 w-20 shrink-0 rounded-full"></span>
                            </p>
                          </div>
                        </div>
                        <div className="right-states-area">
                          <p className="data-titme-latest-message forms-bold text-mono-50">
                            <span className="skeleton bg-mono-40 block  h-2 w-8 shrink-0 rounded-full"></span>
                          </p>
                        </div>
                      </li>
                    </>
                  ) : (
                    filteredConversations?.map(conversation => (
                      <li
                        key={conversation?.conversationId}
                        className={`conversation-list-item flex justify-between items-center hover:bg-[#F1F1F7] cursor-pointer h-[72px] py-2 pl-[17px] pr-[10px] mb-2 ${selectedConversationId === conversation.conversationId ? 'bg-[#f1f1f7]' : ''} ${conversation?.lastMessage?.status === 'unread' ? 'bg-[#F1F1F7]' : ''}`}
                        onClick={() =>
                          handleConversationClick(conversation.conversationId)
                        }
                      >
                        <div className="conversation-item-cont flex gap-[27px] items-center">
                          <div className="user-image">
                            <Image
                              src={
                                conversation?.lastMessage?.sender?._id ===
                                session?.user?.id
                                  ? conversation?.lastMessage?.recipient
                                      ?.profileImage ||
                                    '/images/icons/elisp-profile-default-img.svg'
                                  : conversation?.lastMessage?.sender
                                      ?.profileImage ||
                                    '/images/icons/elisp-profile-default-img.svg'
                              }
                              alt={
                                conversation?.lastMessage?.sender?._id ===
                                session?.user?.id
                                  ? conversation?.lastMessage?.recepient
                                      ?.charityName ||
                                    conversation?.lastMessage?.recepient
                                      ?.firstName ||
                                    'User Image'
                                  : conversation?.lastMessage?.sender
                                      ?.charityName ||
                                    conversation?.lastMessage?.sender
                                      ?.firstName ||
                                    'User Image'
                              }
                              className="min-w-10 max-w-10 min-h-10 max-h-10 object-cover rounded-full"
                              width={320}
                              height={480}
                            />
                          </div>
                          <div className="user-info">
                            <p
                              className={`name forms-bold text-mono-100 ${conversation?.lastMessage?.status === 'unread' ? 'bold' : ''}`}
                            >
                              {conversation?.lastMessage?.sender?._id ===
                              session?.user?.id
                                ? conversation?.lastMessage?.recipient
                                    ?.charityName ||
                                  conversation?.lastMessage?.recipient
                                    ?.firstName ||
                                  ''
                                : conversation?.lastMessage?.sender
                                    ?.charityName ||
                                  conversation?.lastMessage?.sender
                                    ?.firstName ||
                                  ''}
                            </p>
                            <p
                              className={`content forms-bold  ${conversation?.lastMessage?.status === 'unread' ? 'text-mono-100' : 'text-mono-50'}`}
                            >
                              <span className="bold">
                                {conversation?.lastMessage?.sender?._id ===
                                session?.user?.id
                                  ? 'You :'
                                  : ''}{' '}
                              </span>
                              {conversation?.lastMessage?.content?.slice(
                                0,
                                100
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="right-states-area">
                          {/* <Button
                            onClick={() =>
                              handleDeleteConversation(
                                conversation.conversationId
                              )
                            }
                            variant="accend-link"
                          >
                            <DeleteIcon />
                          </Button> */}
                          <p className="data-titme-latest-message forms-bold text-mono-50">
                            {formatMessageTime(
                              conversation?.lastMessage?.createdAt
                            )}
                          </p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Right panel: Conversation Details */}
              <div className="message-right-area col-span-7 sm:col-span-full">
                <div className="message-main-content-wrapper flex flex-col h-full w-full pt-[17px] pb-[22px] px-12">
                  <Image
                    src="/images/logo-message.svg"
                    alt="message area brand logo"
                    width={111}
                    height={35}
                    className="w-[111px] h-[34px] mx-auto mb-6"
                  />
                  <div className="chat-conversion-area">
                    {loading ? (
                      <>
                        <div>
                          <p className="time-temps-per-day text-center flex items-center justify-center eyebrow-small text-mono-90 uppercase mb-6">
                            <span className="skeleton bg-mono-40 block  h-2 w-20 shrink-0 rounded-full"></span>
                          </p>
                          <div className="sender-message mb-6 max-w-[550px] ml-auto">
                            <div className="user-info flex items-center flex-row-reverse gap-[11px]">
                              <div className="user-image">
                                <div className="skeleton bg-mono-40 block  h-6 w-6 shrink-0 rounded-full"></div>
                              </div>

                              <div className="user-info flex items-center gap-2 flex-row-reverse">
                                <p className="name forms-bold text-mono-100">
                                  <span className="skeleton bg-mono-40 block  h-2 w-6 shrink-0 rounded-full"></span>
                                </p>
                                <p className="msg-time forms-bold text-mono-70">
                                  <span className="skeleton bg-mono-40 block  h-2 w-9 shrink-0 rounded-full"></span>
                                </p>
                              </div>
                            </div>
                            <div className="message-cont-box flex pr-[35px]">
                              <p className="message-content inline-block pt-[15px] text-mono-100 forms-bold pr-[26px] pb-7 pl-[25px] bg-[#F6F8FA] ml-auto">
                                <span className="skeleton bg-mono-40 block  h-10 w-[250px] shrink-0 rounded-[4px]"></span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="recipient-message mb-6 max-w-[550px] mr-auto">
                            <div className="user-info flex items-center  gap-[11px]">
                              <div className="user-image">
                                <div className="skeleton bg-mono-40 block  h-6 w-6 shrink-0 rounded-full"></div>
                              </div>

                              <div className="user-info flex items-center gap-2">
                                <p className="name forms-bold text-mono-100">
                                  {' '}
                                  <span className="skeleton bg-mono-40 block  h-2 w-6 shrink-0 rounded-full"></span>
                                </p>
                                <p className="msg-time forms-bold text-mono-70">
                                  <span className="skeleton bg-mono-40 block  h-2 w-9 shrink-0 rounded-full"></span>
                                </p>
                              </div>
                            </div>
                            <div className="message-cont-box flex pl-[35px]">
                              <p className="message-content inline-block pt-[15px] text-mono-100 forms-bold pr-[26px] pb-7 pl-[25px] bg-[#F6F8FA] ">
                                {' '}
                                <span className="skeleton bg-mono-40 block  h-10 w-[250px] shrink-0 rounded-[4px]"></span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="sender-message mb-6 max-w-[550px] ml-auto">
                            <div className="user-info flex items-center flex-row-reverse gap-[11px]">
                              <div className="user-image">
                                <div className="skeleton bg-mono-40 block  h-6 w-6 shrink-0 rounded-full"></div>
                              </div>

                              <div className="user-info flex items-center gap-2 flex-row-reverse">
                                <p className="name forms-bold text-mono-100">
                                  <span className="skeleton bg-mono-40 block  h-2 w-6 shrink-0 rounded-full"></span>
                                </p>
                                <p className="msg-time forms-bold text-mono-70">
                                  <span className="skeleton bg-mono-40 block  h-2 w-9 shrink-0 rounded-full"></span>
                                </p>
                              </div>
                            </div>
                            <div className="message-cont-box flex pr-[35px]">
                              <p className="message-content inline-block pt-[15px] text-mono-100 forms-bold pr-[26px] pb-7 pl-[25px] bg-[#F6F8FA] ml-auto">
                                <span className="skeleton bg-mono-40 block  h-10 w-[250px] shrink-0 rounded-[4px]"></span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {groupedMessages?.map(group => (
                          <div key={group.date}>
                            <p className="time-temps-per-day text-center eyebrow-small text-mono-90 uppercase mb-6">
                              {group.date}
                            </p>
                            {group?.messages.map(message => (
                              <div
                                key={message._id}
                                className={
                                  message?.sender?._id === session.user.id
                                    ? 'sender-message mb-6 max-w-[550px] ml-auto'
                                    : 'recipient-message mb-6 max-w-[550px] mr-auto'
                                }
                              >
                                <div
                                  className={`user-info flex items-center ${
                                    message?.sender?._id === session.user.id
                                      ? 'flex-row-reverse'
                                      : ''
                                  } gap-[11px]`}
                                >
                                  <div className="user-image">
                                    <Image
                                      src={
                                        message?.sender?.profileImage ||
                                        '/images/icons/elisp-profile-default-img.svg'
                                      }
                                      alt={
                                        message?.sender?._id === session.user.id
                                          ? message?.sender?.firstName
                                          : message?.sender?.charityName
                                      }
                                      width={24}
                                      height={24}
                                      className="w-6 h-6 object-cover rounded-full"
                                    />
                                  </div>

                                  <div
                                    className={`user-info flex items-center gap-2 ${message?.sender?._id === session.user.id ? 'flex-row-reverse' : ''}`}
                                  >
                                    <p className="name forms-bold text-mono-100">
                                      {message?.sender?._id === session.user.id
                                        ? 'You'
                                        : message?.sender?.userName}
                                    </p>
                                    <p className="msg-time forms-bold text-mono-70">
                                      {new Date(
                                        message?.createdAt
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className={`message-cont-box flex ${
                                    message?.sender?._id === session.user.id
                                      ? 'pr-[35px]'
                                      : 'pl-[35px]'
                                  }`}
                                >
                                  <p
                                    className={`message-content inline-block pt-[15px] text-mono-100 forms-bold pr-[26px] pb-7 pl-[25px] bg-[#F6F8FA] ${
                                      message?.sender?._id === session.user.id
                                        ? ' ml-auto'
                                        : ''
                                    }`}
                                  >
                                    {message?.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="message-input-are relative mt-auto">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Write your message..."
                      className="pl-[17px] py-2 body-bold-small text-mono-100 placeholder:text-[#CDD3DA] h-9 w-full pr-10 bg-[#F6F8FA] rounded-[24px]"
                    />
                    <Button
                      onClick={handleSendMessage}
                      variant="accend-link"
                      className="h-9 absolute top-0 right-0 bottom-0 my-auto"
                    >
                      <Image
                        src="/images/Send.svg"
                        alt="send icon image"
                        className="w-[17px] h-[18px] text-mono-70"
                        width={17}
                        height={18}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationPage;
