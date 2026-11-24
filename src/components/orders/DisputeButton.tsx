'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Button, Input } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';

interface DisputeButtonProps {
  orderId: string;
  disputeStatus?: string;
  onOpened?: () => void;
}

const DisputeButton: React.FC<DisputeButtonProps> = ({
  orderId,
  disputeStatus = 'NONE',
  onOpened,
}) => {
  const { data: session } = useSession() || {};
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (disputeStatus === 'OPEN') {
    return (
      <span className="inline-flex px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
        Dispute open
      </span>
    );
  }

  if (disputeStatus === 'RESOLVED') {
    return (
      <span className="inline-flex px-3 py-1 rounded-full bg-mono-40 text-mono-80 text-xs font-semibold">
        Dispute resolved
      </span>
    );
  }

  const submit = async () => {
    if (!session?.token) return;
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/dispute`,
        { notes },
        { headers: { Authorization: `Bearer ${session.token}` } }
      );
      ToastService.success('Dispute opened. Our team will review.');
      setOpen(false);
      onOpened?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Could not open dispute.';
      ToastService.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dispute
      </Button>
    );
  }

  return (
    <div className="space-y-2 mt-3 p-3 rounded-xl border border-amber-200 bg-amber-50/50">
      <p className="caption text-mono-80">Describe the issue (optional)</p>
      <Input
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Item not received, wrong item, etc."
      />
      <div className="flex gap-2">
        <Button variant="primary" onClick={submit} disabled={loading}>
          {loading ? 'Submitting…' : 'Submit dispute'}
        </Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DisputeButton;
