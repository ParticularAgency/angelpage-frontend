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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10060] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[#0B0112]/45"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-3xl border border-[#E6E3E7] bg-white p-6 shadow-[0_24px_80px_rgba(97,17,146,0.18)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
          Angelpage
        </p>
        <h3 className="font-primary mt-2 text-3xl text-[#0B0112]">Your item is listed</h3>
        <p className="mt-2 text-sm leading-6 text-[#5C5560]">
          Buyers can find it in the shop. You can list another item, or open this one.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" className="rounded-full!" onClick={onClose}>
            View listing
          </Button>
          <Button variant="primary" className="rounded-full!" onClick={onConfirm}>
            List another
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
