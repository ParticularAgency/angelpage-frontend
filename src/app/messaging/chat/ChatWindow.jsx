import React, { useEffect, useRef } from 'react';

const ChatWindow = ({ messages, currentUserId }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window flex flex-col gap-3 overflow-y-auto max-h-[60vh] p-2">
      {messages.map((message) => {
        const isOwn = message.sender?._id === currentUserId;
        return (
          <div
            key={message._id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                isOwn
                  ? 'bg-primary-color-100 text-white rounded-br-sm'
                  : 'bg-[#F6F8FA] text-mono-100 rounded-bl-sm'
              }`}
            >
              <p className="body-small">{message.content}</p>
              <small className="block text-right opacity-70 text-[10px] mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </small>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
};

export default ChatWindow;
