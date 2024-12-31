'use client';
import { Button } from '@/components/elements';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 shadow-lg max-w-md w-full">
        <h3 className="h4 font-primary mb-1 text-left">Success!</h3>
        <p className="body-small text-left mb-6">
          Your product has been posted successfully.
        </p>
        <p className="body-small mb-3 block">
          Would you like to sell another product?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" className="" onClick={onClose}>
            No, thanks
          </Button>
          <Button variant="primary" className="" onClick={onConfirm}>
            Yes, sell another
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
