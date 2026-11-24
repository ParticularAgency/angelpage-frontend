import React, { useState } from 'react';
import { Button } from '@/components/elements';

const MessageInput = ({ onSendMessage, disabled = false, placeholder = 'Type a message...' }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input flex gap-2 items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 h-10 px-4 bg-[#F6F8FA] rounded-full body-small focus:outline-hidden focus:ring-2 focus:ring-primary-color-100/30"
      />
      <Button
        variant="primary"
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="min-w-[80px]!"
      >
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
