import React from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/elements';

const MessageButton = ({ sellerId, sellerType }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const buyerId = session?.user?.id;
  const buyerType = session?.user?.role; // Assuming the role is "USER" or "CHARITY"

  const handleMessage = async () => {
    if (!session?.token || !buyerId || !buyerType || !sellerId || !sellerType) {
      console.error(
        'Missing required fields: Buyer ID, Seller ID, Buyer Type, or Seller Type'
      );
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/message/conversations/start`,
        { buyerId, buyerType, sellerId, sellerType },
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (response.data.success) {
        router.push(`/messaging/chat/${response.data.conversation._id}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  return (
    <Button variant='primary' onClick={handleMessage} className="">
      Message
    </Button>
  );
};

export default MessageButton;
