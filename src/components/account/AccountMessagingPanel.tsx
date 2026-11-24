'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const ConversationPage = dynamic(
  () => import('@/app/messaging/chat/Conversation'),
  { ssr: false, loading: () => <p className="body-small text-mono-70 py-8">Loading messages…</p> }
);

const AccountMessagingPanel = () => (
  <div className="account-messaging-panel">
    <ConversationPage embedded />
  </div>
);

export default AccountMessagingPanel;
