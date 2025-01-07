import React from 'react';

const ChatWindow = ({ messages, currentUserId }) => {
  return (
    <div className="chat-window">
      {messages.map(message => (
        <div
          key={message._id}
          className={`message ${
            message.sender._id === currentUserId
              ? 'message-outgoing'
              : 'message-incoming'
          }`}
        >
          <p>{message.content}</p>
          <small>{new Date(message.createdAt).toLocaleTimeString()}</small>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
