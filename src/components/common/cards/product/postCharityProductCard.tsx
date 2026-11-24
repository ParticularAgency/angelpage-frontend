'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { LocationIcon } from '@/icons';
import FavoriteButton from '@/components/elements/button/FavoriteButton';
import { Archive, Pencil, RotateCcw, Trash2 } from 'lucide-react';

interface ProductCardProps {
  productId: string;
  charityImageSrc: string;
  charityImageAlt?: string;
  productImageSrc: string;
  productImageAlt: string;
  productBrand?: string;
  productTitle?: string;
  productSize?: string;
  productPrice?: string;
  location?: string;
  isArchived?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onRelist?: () => void;
  // isArchived: boolean;
  status: 'DRAFT' | 'LIVE' | 'REMOVED' | 'PENDING_REVIEW';
  averageDeliveryTime?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  charityImageSrc = '/images/icons/elisp-profile-default-img.svg',
  charityImageAlt = 'Charity Image',
  productImageSrc = '/images/products/card-placeholder-image.webp',
  productImageAlt = 'Product Image',
  productBrand = 'Unknown Brand',
  productTitle = 'No Title',
  productSize = 'One Size',
  productPrice = 'N/A',
  location = 'No Location',
  onDelete,
  onEdit,
  onArchive,
  onRelist,
  status,
  //averageDeliveryTime,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = () => setIsConfirmOpen(true);
  const handleCancel = () => setIsConfirmOpen(false);
  const handleConfirmAction = () => {
    if ((status === 'DRAFT' || status === 'PENDING_REVIEW' || status === 'REMOVED') && onDelete) {
      onDelete();
    } else if (status === 'LIVE' && onArchive) {
      onArchive();
    }
    setIsConfirmOpen(false);
  };

  const ActionIconButton = ({
    label,
    onClick,
    icon,
    danger = false,
  }: {
    label: string;
    onClick?: () => void;
    icon: React.ReactNode;
    danger?: boolean;
  }) => (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition ${
        danger
          ? 'border-[#F2D6D6] bg-white text-red-600 hover:bg-red-50'
          : 'border-[#E6E3E7] bg-white text-[#611192] hover:bg-[#FCF2FF]'
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div
      className={`product-card-item bg-mono-0 max-w-[289px] w-full px-[15px] py-4 flex flex-col gap-[33px] border ${status === 'REMOVED' ? 'opacity-80' : ''}`}
    >
      <div className="product-head-cont flex justify-between">
        <div className="donate-charity-img h-[46px] flex items-center">
          <Image
            src={charityImageSrc ?? ''}
            alt={charityImageAlt ?? ''}
            className="w-full h-full object-cover"
            width={46}
            height={46}
          />
        </div>
        <div className="favorite-btn cursor-pointer">
          <FavoriteButton itemId={productId} type="Charity" />
        </div>
      </div>

      <div className="product-body-cont">
        <div className="product-image-modal px-8 sm:px-1 w-full flex justify-center items-center">
          <Image
            className="max-w-[116px] h-[110px] w-full object-cover sm:object-contain sm:h-auto"
            src={productImageSrc ?? ''}
            alt={productImageAlt ?? ''}
            width={180}
            height={170}
          />
        </div>
      </div>

      <div className="product-footer-cont">
        <div className="product-info-box">
          <div className="product-info">
            <div className="prod-title-box flex justify-between items-start">
              <h6 className="product-brand-title eyebrow-medium">
                {productBrand ?? ''}
              </h6>
              <p className="product-price sm:hidden  body-bold-small">
                £{productPrice || 'N/A'}
              </p>
            </div>
            <p className="product-title caption-bold mt-2 text-mono-60">
              {productTitle ?? ''}
            </p>
            <div className="product-size mt-3 eyebrow-small">
              {productSize ?? ''}
            </div>
          </div>
          <p className="product-price mt-3 hidden sm:block body-bold-small">
            £{productPrice || 'N/A'}
          </p>
        </div>

        <div className="product-location mt-4 flex items-center gap-2">
          <span>
            <LocationIcon />
          </span>
          <span className="location-text caption">{location ?? ''}</span>
        </div>

        <div className="product-card-btn-box mt-3 flex items-center justify-end gap-2">
          {status === 'DRAFT' && (
            <>
              {onEdit && (
                <ActionIconButton
                  label="Edit"
                  onClick={onEdit}
                  icon={<Pencil className="h-4 w-4" aria-hidden />}
                />
              )}
              {onDelete && (
                <ActionIconButton
                  label="Delete"
                  onClick={handleDeleteClick}
                  icon={<Trash2 className="h-4 w-4" aria-hidden />}
                  danger
                />
              )}
            </>
          )}
          {status === 'LIVE' && (
            <>
              {onEdit && (
                <ActionIconButton
                  label="Edit"
                  onClick={onEdit}
                  icon={<Pencil className="h-4 w-4" aria-hidden />}
                />
              )}
              {onArchive && (
                <ActionIconButton
                  label="Archive"
                  onClick={handleDeleteClick}
                  icon={<Archive className="h-4 w-4" aria-hidden />}
                />
              )}
            </>
          )}
          {status === 'PENDING_REVIEW' && (
            <>
              {onEdit && (
                <ActionIconButton
                  label="Edit"
                  onClick={onEdit}
                  icon={<Pencil className="h-4 w-4" aria-hidden />}
                />
              )}
              {onDelete && (
                <ActionIconButton
                  label="Delete"
                  onClick={handleDeleteClick}
                  icon={<Trash2 className="h-4 w-4" aria-hidden />}
                  danger
                />
              )}
            </>
          )}
          {status === 'REMOVED' && (
            <>
              {onRelist && (
                <ActionIconButton
                  label="Republish"
                  onClick={onRelist}
                  icon={<RotateCcw className="h-4 w-4" aria-hidden />}
                />
              )}
              {onDelete && (
                <ActionIconButton
                  label="Delete"
                  onClick={handleDeleteClick}
                  icon={<Trash2 className="h-4 w-4" aria-hidden />}
                  danger
                />
              )}
            </>
          )}
          {/* {status === 'Removed' && <p className="text-red-500">Removed</p>} */}
        </div>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-6 shadow-lg max-w-sm w-full mx-4">
            <h3 className="h6 font-primary">Are you sure?</h3>
            <p className="text-body-small mt-2">
              {status === 'LIVE'
                ? 'This will archive the product.'
                : 'This will permanently delete the product.'}
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="h-10 rounded-xl border border-[#E6E3E7] bg-white px-4 text-sm font-semibold text-mono-100"
                onClick={handleCancel}
              >
                No
              </button>
              <button
                type="button"
                className="h-10 rounded-xl bg-[#611192] px-4 text-sm font-semibold text-white"
                onClick={handleConfirmAction}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
