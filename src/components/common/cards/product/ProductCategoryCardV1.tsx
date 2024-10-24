import Image from 'next/image';
import React from 'react';

// Define the prop types for the ProductCategoryCardV1 component
interface ProductCategoryCardV1Props {
  imageSrc: string;
  imageAlt: string;
  categoryTitle: string;
}

const ProductCategoryCardV1: React.FC<ProductCategoryCardV1Props> = ({ imageSrc, imageAlt, categoryTitle }) => {
  return (
    <div className='product-category-card-item max-w-[225px] w-full'>
      <div className="product-category-img-box flex items-center justify-center w-full  h-[270px] md:h-[215px] px-6 py-10 bg-[#FAFAFB]">
        <Image src={imageSrc} alt={imageAlt} width={150} height={150} />
      </div>
      <p className="product-subcategory-title text-center eyebrow-medium mt-[17px] text-mono-100">{categoryTitle}</p>
    </div>
  );
};

export default ProductCategoryCardV1;

