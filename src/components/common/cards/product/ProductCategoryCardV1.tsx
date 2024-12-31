'use client';
import { Button } from '@/components/elements';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ProductCategoryCardV1Props {
  productImageSrc: string;
  productImageAlt: string;
  productTitle?: string;
  productCategory?: string;
}

const ProductCategoryCardV1: React.FC<ProductCategoryCardV1Props> = ({
  productImageSrc,
  productImageAlt,
  productTitle,
  productCategory,
}) => {
  return (
    <div className="product-category-card-item max-w-[225px] w-full">
      <div className="product-category-img-box relative flex items-center justify-center w-full  h-[270px] md:h-[215px] px-6 py-10 bg-[#FAFAFB]">
        <Image
          src={productImageSrc ?? ''}
          alt={productImageAlt ?? ''}
          width={150}
          height={150}
        />
        <div className="product-btn absolute left-0 right-0 top-0 bottom-0 w-full h-full z-[999] flex items-center justify-center p-2">
          <Link href={productCategory || ''}>
            <Button
              variant="primary"
              className="view-current-category-btn"
              onClick={() => console.log('show current category product')}
            >
              View More
            </Button>
          </Link>
        </div>
      </div>
      <p className="product-subcategory-title text-center eyebrow-medium mt-[17px] text-mono-100">
        {productTitle ?? ''}
      </p>
    </div>
  );
};

export default ProductCategoryCardV1;
