import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/elements';

// Helper to check if an error is an AxiosError
function isAxiosError(error) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    error.isAxiosError === true
  );
}

const DeleteAccount = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { data: session } = useSession();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    console.log('Session data:', session);
  }, [session]);

  const handleDeleteAccount = async () => {
    if (!session) {
      setMessage('You need to be logged in to delete your account.');
      return;
    }

    try {
      const formData = new FormData();
      const userId = session.user?.id || '';
      const role = session.user?.role || '';

      if (!userId || !role) {
        throw new Error('Invalid user session: Missing userId or role.');
      }

      formData.append('userId', userId);
      formData.append('role', role);

      const response = await axios.request({
        url: `${API_URL}/auth/delete-account`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      });

      if (response.data?.message) {
        setMessage(response.data.message);
        await signOut();
        router.push('/');
      } else {
        console.error('Invalid response structure:', response.data);
        setMessage('Failed to delete account. Please try again.');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(
          'Error deleting account:',
          error.response?.data || error.message
        );
        setMessage(
          error.response?.data?.message ||
            'Failed to delete the account. Please try again.'
        );
      } else {
        console.error('Unexpected error:', error);
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const openConfirmation = () => {
    setIsConfirmOpen(true);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <div className="delete-account-wrapper pt-4 pb-20">
      <h6 className="h6 title mb-4">Delete User Account</h6>
      <p className="desc body-small max-w-[610px] w-full">
        This action will delete your user account. It cannot be undone, and all
        content associated with this account will be permanently lost.
      </p>
      {message && <p className="message text-red-500">{message}</p>}
      <Button variant="primary" className="mt-6" onClick={openConfirmation}>
        Delete account
      </Button>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-50">
          <div className="bg-white p-6 shadow-lg max-w-sm w-full mx-4">
            <h3 className="h6 font-primary">
              Are you sure you want to delete your user account?
            </h3>
            <p className="text-body-small mt-2">
              This action cannot be undone. Deleting your user account will
              permanently remove all data associated with it.
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="secondary" onClick={handleCancel}>
                No
              </Button>
              <Button variant="primary" onClick={handleDeleteAccount}>
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
