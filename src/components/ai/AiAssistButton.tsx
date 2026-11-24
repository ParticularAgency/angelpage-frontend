'use client';

import React from 'react';
import { Button } from '@/components/elements';

type AiAssistButtonProps = {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accend-link';
};

const AiAssistButton = ({
  label = '✨ AI assist',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  variant = 'secondary',
}: AiAssistButtonProps) => (
  <Button
    type="button"
    variant={variant}
    className={className}
    disabled={disabled || loading}
    onClick={onClick}
  >
    {loading ? 'AI thinking…' : label}
  </Button>
);

export default AiAssistButton;
