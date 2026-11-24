'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import SocialPostingToggles, {
  defaultSocialPostingPrefs,
  type SocialPostingPrefs,
} from './SocialPostingToggles';

interface AdminSocialPostingPanelProps {
  productId: string;
  token: string;
  initialPrefs?: SocialPostingPrefs;
  listingVideoUrl?: string;
  onChange?: (prefs: SocialPostingPrefs) => void;
  /** When true, only update local state (e.g. before approve) */
  deferSave?: boolean;
}

const AdminSocialPostingPanel = ({
  productId,
  token,
  initialPrefs,
  listingVideoUrl = '',
  onChange,
  deferSave = false,
}: AdminSocialPostingPanelProps) => {
  const [prefs, setPrefs] = useState<SocialPostingPrefs>(
    initialPrefs || defaultSocialPostingPrefs()
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialPrefs) setPrefs(initialPrefs);
  }, [initialPrefs]);

  const handleChange = (next: SocialPostingPrefs) => {
    setPrefs(next);
    onChange?.(next);
  };

  const handleSave = async () => {
    if (deferSave) return;
    try {
      setSaving(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/social-posting`,
        prefs,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      ToastService.success('Social posting preferences saved');
    } catch {
      ToastService.error('Failed to save social preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3">
      <SocialPostingToggles
        value={prefs}
        onChange={handleChange}
        compact
        listingVideoUrl={listingVideoUrl}
      />
      <p className="text-[11px] text-mono-70 mt-2">
        Admin: channels selected here are used when this listing is approved.
      </p>
      {!deferSave && (
        <Button
          variant="secondary"
          className="w-full mt-2 text-primary-color-100! border-primary-color-100!"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save social channels'}
        </Button>
      )}
    </div>
  );
};

export default AdminSocialPostingPanel;
