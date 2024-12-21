import React, { useState } from 'react';
import Image from 'next/image';
import {   LocationIcon } from '@/icons';
import { Button } from '@/components/elements';
import FavoriteButton from '@/components/elements/button/FavoriteButton';


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
  onDelete?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  // isArchived: boolean;
  status: 'DRAFT' | 'LIVE' | 'REMOVED';
  averageDeliveryTime?: number;
  isArchived?: boolean;
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
    // onEdit,
    onArchive,
    status,
  // averageDeliveryTime,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = () => setIsConfirmOpen(true);
  const handleCancel = () => setIsConfirmOpen(false);
  const handleConfirmAction = () => {
    if (status === 'DRAFT' && onDelete) {
      onDelete();
    } else if (status === 'LIVE' && onArchive) {
      onArchive();
    }
    setIsConfirmOpen(false);
  };

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
          <FavoriteButton itemId={productId} type="Product" />
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
              <p className="product-price sm:hidden body-bold">
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

        <div className="product-card-btn-box mt-3 flex items-center sm:items-start sm:flex-col-reverse sm:w-full gap-4 sm:gap-2">
          {status === 'DRAFT' && (
            <>
              {/* <Button
                variant="primary"
                className="product-states-btn sm:w-full block max-w-full"
              >
                Continue
              </Button> */}
              <Button
                // variant="accend-link"
                variant="primary"
                className="p-4 w-full h-10"
                onClick={handleDeleteClick}
              >
                {/* <DeleteIcon width={14} height={14} color="#611192" /> */}
                Delete
              </Button>
            </>
          )}
          {status === 'LIVE' && (
            <>
              {/* <Button
                variant="primary"
                className="product-states-btn sm:w-full block max-w-full"
                // onClick={}
              >
                Edit listing
              </Button> */}
              <Button
                // variant="accend-link"
                variant="primary"
                className="p-4 w-full h-10"
                onClick={handleDeleteClick}
              >
                {/* <DeleteIcon width={14} height={14} color="#611192" /> */}
                Delete
              </Button>
            </>
          )}
          {/* {status === 'Removed' && <p className="text-red-500">Removed</p>} */}
        </div>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 shadow-lg max-w-sm w-full mx-4">
            <h3 className="h6 font-primary">Are you sure?</h3>
            <p className="text-body-small mt-2">
              {status === 'DRAFT'
                ? 'This will permanently delete the product.'
                : 'This will archive the product.'}
            </p>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="secondary" onClick={handleCancel}>
                No
              </Button>
              <Button variant="primary" onClick={handleConfirmAction}>
                Yes, {status === 'DRAFT' ? 'delete' : 'archive'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
