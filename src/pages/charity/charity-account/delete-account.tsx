import React, { useState } from 'react';
import { Button } from '@/components/elements'; 

const DeleteAccount = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Function to open confirmation modal
  const openConfirmation = () => {
    setIsConfirmOpen(true);
  };

  // Function to handle account deletion
  const handleDeleteAccount = () => {
    console.log('Account deleted');
    setIsConfirmOpen(false); // Close modal after action
  };

  // Function to cancel and close the modal
  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <div className="delete-account-wrapper pt-4 pb-20">
      <h6 className="h6 title mb-4">Delete account</h6>
      <p className="desc body-small max-w-[610px] w-full">
        Would you like to delete your account? This action cannot be undone and all content associated with this account will be lost.
      </p>

      <Button variant="primary" className="mt-6" onClick={openConfirmation}>
        Delete account
      </Button>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h3 className="h6 font-primary">Are you sure?</h3>
            <p className="text-body-small mt-2">This action cannot be undone.</p>
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
