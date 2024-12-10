'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DetailsForm from './forms/DetailsForm';
import PhotosForm from './forms/PhotosForm';
import PriceForm from './forms/PriceForm';
import TabNavigation from './navigation/TabNavigation';
import ConfirmationModal from './forms/popupModal';

interface UploadedImage {
  id: number;
  src: string;
  isFeatured: boolean;
}

interface FormData {
  charity: string;
  itemTitle: string;
  selectedCategory: string;
  selectedSubCategory: string;
  condition: string;
  brand: string;
  material: string;
  color: string;
  size: string;
  additionalInfo: string;
  images: UploadedImage[];
  featuredImage: UploadedImage | null;
  price: string;
  charityProfit: string;
  stepCompletion: {
    details: boolean;
    photos: boolean;
    price: boolean;
  };
}

interface DetailsData {
  charity?: string;
  itemTitle?: string;
  condition?: string;
  brand?: string;
  material?: string;
  size?: string;
  additionalInfo?: string;
  color?: string;
  selectedCategory?: string;
  selectedSubCategory?: string;
}

interface PriceData {
  price: string;
  charityProfit?: string;
}

const SellAnItem: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'price'>(
    'details'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormData: FormData = {
    charity: '',
    itemTitle: '',
    condition: '',
    brand: '',
    material: '',
    size: '',
    additionalInfo: '',
    color: '',
    selectedCategory: 'Select',
    selectedSubCategory: 'Select',
    images: [],
    featuredImage: null,
    price: '',
    charityProfit: '',
    stepCompletion: { details: false, photos: false, price: false },
  };

  const formDataRef = useRef<FormData>(initialFormData);

  const updateFormData = (newData: Partial<FormData>) => {
    formDataRef.current = { ...formDataRef.current, ...newData };
  };

  const updateDetails = (detailsData: DetailsData) => {
    updateFormData({
      ...detailsData,
      stepCompletion: { ...formDataRef.current.stepCompletion, details: true },
    });
    setActiveTab('photos');
  };

  const updateImages = (newImages: UploadedImage[]) => {
    updateFormData({
      images: newImages,
      featuredImage: newImages.find(image => image.isFeatured) || null,
      stepCompletion: { ...formDataRef.current.stepCompletion, photos: true },
    });
  };

  const handleImageSubmit = ({ images }: { images: UploadedImage[] }) => {
    updateImages(images);
    setActiveTab('price');
  };

  // Updated updatePrice function to return Promise<void>
  const updatePrice = async (priceData: PriceData): Promise<void> => {
    updateFormData({
      ...priceData,
      stepCompletion: { ...formDataRef.current.stepCompletion, price: true },
    });
  };

  const handleFinalSubmit = () => {
    const finalData = formDataRef.current;
    console.log('Final submission data:', finalData);
    setIsModalOpen(true); // Show confirmation modal
  };

  const handleBack = (currentTab: 'details' | 'photos' | 'price') => {
    const newStepCompletion = {
      ...formDataRef.current.stepCompletion,
      [currentTab]: false,
    };
    updateFormData({ stepCompletion: newStepCompletion });

    switch (currentTab) {
      case 'photos':
        setActiveTab('details');
        break;
      case 'price':
        setActiveTab('photos');
        break;
      default:
        break;
    }
  };

  const handleUpdateImages = (newImages: UploadedImage[]) => {
    updateImages(newImages);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    router.push('/'); // Navigate to home on cancel (can replace with account page path in future)
  };

  const confirmAnotherPost = () => {
    formDataRef.current = initialFormData; // Reset to initial data
    setActiveTab('details'); // Go back to details
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="max-w-[590px] m-auto pt-14 pb-[111px] sm:pb-18">
      <div className="flex sm:flex-col gap-5">
        <div className="sm:w-full sm:px-4 w-full max-w-[183px] sm:max-w-full sticky top-8 h-[30vh]">
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stepCompletion={formDataRef.current.stepCompletion}
          />
        </div>
        <div className="sm:w-full sm:px-4 w-3/4">
          {activeTab === 'details' && (
            <DetailsForm
              setActiveTab={setActiveTab}
              onSubmit={updateDetails}
              formData={formDataRef.current}
            />
          )}
          {activeTab === 'photos' && (
            <PhotosForm
              setActiveTab={setActiveTab}
              onSubmit={handleImageSubmit}
              onUpdateImages={handleUpdateImages}
              images={formDataRef.current.images}
              onBack={() => handleBack('photos')}
              formData={formDataRef.current}
            />
          )}
          {activeTab === 'price' && (
            <PriceForm
              setActiveTab={setActiveTab}
              onSubmit={updatePrice} // This should now work correctly
              onBack={() => handleBack('price')}
              onFinish={handleFinalSubmit}
              formData={formDataRef.current}
            />
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmAnotherPost}
      />
    </div>
  );
};

export default SellAnItem;
