import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';

const MessageButton = ({
  sellerId,
  sellerType,
  productId,
  productName,
  disabled = false,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const buyerId = session?.user?.id;
  const buyerType = session?.user?.role;

  const handleMessage = async () => {
    if (!session?.token || !buyerId || !buyerType || !sellerId || !sellerType) {
      console.error('Missing required fields for starting a conversation');
      return;
    }

    if (buyerId === sellerId) {
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/message/conversations/start`,
        {
          buyerId,
          buyerType,
          sellerId,
          sellerType,
          productId: productId || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (response.data.success) {
        const convId = response.data.conversation._id;
        router.push(`/messaging/chat/${convId}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  if (buyerId === sellerId) {
    return null;
  }

  return (
    <Button
      variant="primary"
      onClick={handleMessage}
      disabled={disabled || !session?.token}
      className="min-w-[100px]!"
    >
      {productName ? 'Ask about item' : 'Message'}
    </Button>
  );
};

export default MessageButton;
