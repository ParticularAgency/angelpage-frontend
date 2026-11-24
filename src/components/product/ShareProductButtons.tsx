'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ToastService } from '@/components/elements/notifications/ToastService';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  ShearIcon,
  TikTokIcon,
  TwitterIcon,
  WhatsAppIcon,
} from '@/icons';
import {
  CHARITY_SHARE_PERCENT,
  formatCharityProfit,
} from '@/constants/brand';
import {
  buildSharePayload,
  type ProductShareDetails,
  type SharePayload,
} from '@/utils/buildProductShareMessage';

interface ShareProductButtonsProps {
  product: ProductShareDetails;
}

type SocialPlatform = {
  id: string;
  label: string;
  icon: React.FC;
  getUrl: (payload: SharePayload) => string;
  copyBeforeOpen?: boolean;
  messageKey?: 'fullMessage' | 'shortMessage';
  /** Facebook blocks pre-filled post text — always copy + use link sharer */
  isFacebook?: boolean;
};

/**
 * Facebook does not allow pre-filled post text via URL (policy).
 * dialog/feed opens an empty composer — use dialog/share or sharer.php with link only.
 * Product details are copied to clipboard for the user to paste (Ctrl+V).
 */
const getFacebookShareUrl = (payload: SharePayload) => {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  if (appId) {
    const params = new URLSearchParams({
      app_id: appId,
      href: payload.url,
      display: 'popup',
      redirect_uri: payload.url,
    });
    return `https://www.facebook.com/dialog/share?${params.toString()}`;
  }

  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(payload.url)}`;
};

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'facebook',
    label: 'Facebook',
    icon: FacebookIcon,
    getUrl: getFacebookShareUrl,
    copyBeforeOpen: true,
    messageKey: 'fullMessage',
    isFacebook: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: InstagramIcon,
    getUrl: () => 'https://www.instagram.com/direct/inbox/',
    copyBeforeOpen: true,
    messageKey: 'fullMessage',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    icon: TwitterIcon,
    getUrl: ({ shortMessage }) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortMessage)}`,
    messageKey: 'shortMessage',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: TikTokIcon,
    getUrl: () => 'https://www.tiktok.com/upload',
    copyBeforeOpen: true,
    messageKey: 'fullMessage',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: LinkedinIcon,
    getUrl: ({ fullMessage }) =>
      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(fullMessage)}`,
    messageKey: 'fullMessage',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: WhatsAppIcon,
    getUrl: ({ fullMessage }) =>
      `https://wa.me/?text=${encodeURIComponent(fullMessage)}`,
    messageKey: 'fullMessage',
  },
];

const ShareProductButtons = ({ product }: ShareProductButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const previewPayload = useMemo(
    () => buildSharePayload(product),
    [product]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getPayload = () => buildSharePayload(product);

  const handleCopyLink = async () => {
    const payload = getPayload();

    if (!payload.url) {
      ToastService.error('Product link is not ready yet');
      return;
    }

    try {
      await navigator.clipboard.writeText(payload.fullMessage);
      setCopied(true);
      ToastService.success('Product details copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      ToastService.error('Could not copy link');
    }
  };

  const handleSocialShare = async (platform: SocialPlatform) => {
    const payload = getPayload();

    if (!payload.url) {
      ToastService.error('Product link is not ready yet');
      return;
    }

    const message =
      platform.messageKey === 'shortMessage'
        ? payload.shortMessage
        : payload.fullMessage;

    if (platform.copyBeforeOpen || platform.isFacebook) {
      try {
        await navigator.clipboard.writeText(message);
        if (platform.isFacebook) {
          ToastService.success(
            'Product details copied — paste into Facebook with Ctrl+V (or Cmd+V)'
          );
        } else {
          ToastService.success(
            `Details copied — paste them in your ${platform.label} post`
          );
        }
      } catch {
        ToastService.error('Could not copy details');
      }
    }

    const targetUrl = platform.getUrl(payload);
    const windowName = platform.isFacebook ? 'facebook-share' : '_blank';
    const windowFeatures = platform.isFacebook
      ? 'width=640,height=720,noopener,noreferrer'
      : 'noopener,noreferrer,width=640,height=720';

    window.open(targetUrl, windowName, windowFeatures);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className="current-product-social-share-link cursor-pointer flex items-center justify-center"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Share this listing"
        aria-expanded={isOpen}
      >
        <ShearIcon />
      </button>

      {isOpen && (
        <div className="share-product-popover absolute right-0 top-full z-50 mt-2 w-[300px] rounded-xl border border-mono-40 bg-white p-4 shadow-lg">
          <p className="body-small text-mono-70 mb-3 font-medium">
            Share this listing
          </p>

          <button
            type="button"
            onClick={handleCopyLink}
            className="mb-3 w-full h-9 rounded-full border border-primary-color-100 text-primary-color-100 body-caption font-medium hover:bg-[#FCF2FF]"
          >
            {copied ? 'Copied' : 'Copy details'}
          </button>

          <div className="mb-3 rounded-lg bg-[#FCF2FF] p-3">
            <p className="body-caption text-mono-90 font-medium line-clamp-2">
              {product.name}
            </p>
            <p className="text-[11px] text-mono-70 mt-1 line-clamp-4 whitespace-pre-line">
              {previewPayload.fullMessage}
            </p>
          </div>

          <ul className="flex flex-col gap-1">
            {SOCIAL_PLATFORMS.map(platform => {
              const Icon = platform.icon;
              return (
                <li key={platform.id}>
                  <button
                    type="button"
                    onClick={() => handleSocialShare(platform)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-[#FCF2FF] transition-colors"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-mono-40 bg-white">
                      <Icon />
                    </span>
                    <span className="body-caption text-mono-90 font-medium">
                      {platform.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="text-mono-70 text-[11px] mt-3 pt-3 border-t border-mono-40">
            Charity receives £{formatCharityProfit(product.price)} (
            {CHARITY_SHARE_PERCENT}%)
          </p>
        </div>
      )}
    </div>
  );
};

export default ShareProductButtons;
