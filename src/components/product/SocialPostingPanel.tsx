'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/elements';
import { ToastService } from '@/components/elements/notifications/ToastService';
import SocialPostingToggles, {
  defaultSocialPostingPrefs,
  type SocialPostingPrefs,
} from './SocialPostingToggles';

interface SocialPostingPanelProps {
  productId: string;
  token: string;
  initialPrefs?: SocialPostingPrefs;
  listingVideoUrl?: string;
  compact?: boolean;
}

const SocialPostingPanel = ({
  productId,
  token,
  initialPrefs,
  listingVideoUrl = '',
  compact = true,
}: SocialPostingPanelProps) => {
  const [prefs, setPrefs] = useState<SocialPostingPrefs>(
    initialPrefs || defaultSocialPostingPrefs()
  );
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (initialPrefs) setPrefs(initialPrefs);
  }, [initialPrefs]);

  const handleSave = async () => {
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
    <div className="mt-3 border-t border-mono-40 pt-3">
      <button
        type="button"
        className="caption text-primary-color-100 underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide social posting' : 'Social posting settings'}
      </button>
      {expanded && (
        <div className="mt-3">
          <SocialPostingToggles
            value={prefs}
            onChange={setPrefs}
            compact={compact}
            listingVideoUrl={listingVideoUrl}
          />
          <Button
            variant="secondary"
            className="w-full mt-3 text-primary-color-100! border-primary-color-100!"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save social settings'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialPostingPanel;
