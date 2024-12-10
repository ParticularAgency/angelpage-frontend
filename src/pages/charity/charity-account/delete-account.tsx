import React, { useState, useEffect } from 'react';
import { deleteAccount } from '@/utils/api'; // Import the API function
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/elements';

// Define a custom type for NextAuth session with custom fields
interface CustomSession {
  user: {
    id: string;
    role: 'USER' | 'CHARITY' | 'ADMIN'; // Specify allowed roles
  };
  token: string; // Adjust to match session structure
}

const DeleteAccount: React.FC = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const { data: session } = useSession();
  const router = useRouter();

  // Log the entire session object to debug its structure
  useEffect(() => {
    console.log('Session data:', session);
  }, [session]);

  // Type guard to verify if session data has custom properties and role is "USER"
  const isUserSession = (session: unknown): session is CustomSession => {
    const isUser =
      typeof session === 'object' &&
      session !== null &&
      'user' in session &&
      typeof (session as CustomSession).user.id === 'string' &&
      (session as CustomSession).user.role === 'CHARITY' &&
      'token' in session; // Adjust to check for `token` instead of `accessToken`

    if (!isUser) {
      console.error(
        'Session does not have expected structure or role:',
        session
      );
    }

    return isUser;
  };

  // Function to open confirmation modal
  const openConfirmation = () => {
    setIsConfirmOpen(true);
  };

  const handleDeleteAccount = async () => {
    if (!session || !isUserSession(session)) {
      setMessage('You need to be logged in as a user to delete your account.');
      return;
    }

    try {
      const response = await deleteAccount(
        session.user.id,
        session.user.role,
        session.token
      );

      setMessage(response.message || 'Account deleted successfully.');
      await signOut();
      router.push('/');
    } catch (error: any) {
      if (error.response) {
        console.error('Server responded with:', error.response.data);
        setMessage(error.response.data.message || 'Error deleting account');
      } else {
        console.error('Unexpected error:', error);
        setMessage('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setIsConfirmOpen(false);
    }
  };

  // Function to cancel and close the modal
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
