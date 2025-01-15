'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DetailsForm from './forms/DetailsForm';
import PhotosForm from './forms/PhotosForm';
import PriceForm from './forms/PriceForm';
import TabNavigation from './navigation/TabNavigation';
import ConfirmationModal from './forms/popupModal';
import {
  ToastService,
} from '@/components/elements/notifications/ToastService';

interface UploadedImage {
  id: number;
  src: string;
  file: File;
  isFeatured: boolean;
}
interface Dimensions {
  height?: `${number}${'in' | 'cm'}` | '';
  width?: `${number}${'in' | 'cm'}` | '';
  depth?: `${number}${'in' | 'cm'}` | '';
}
interface FormData {
  charityId: string;
  charityName: string;
  itemTitle: string;
  selectedCategory: string;
  selectedSubCategory: string;
  condition: string;
  brand: string;
  material: string;
  color: string;
  size: string;
  weight: string;
  additionalInfo: string;
  images: UploadedImage[];
  dimensions: Dimensions[];
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
  charityId: string;
  charityName: string;
  itemTitle?: string;
  condition?: string;
  brand?: string;
  material?: string;
  size?: string;
  weight?: string;
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
  const { data: session } = useSession() || {};
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'price'>(
    'details'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormData: FormData = {
    charityId: '',
    charityName: '',
    itemTitle: '',
    condition: '',
    brand: '',
    material: '',
    size: '',
    weight: '',
    dimensions: [],
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
      charityId: detailsData.charityId, // Update charityId as well
      stepCompletion: { ...formDataRef.current.stepCompletion, details: true },
    });
    setActiveTab('photos');
  };

  const updateImages = (newImages: UploadedImage[]) => {
    updateFormData({
      images: newImages,
      featuredImage: newImages.find(img => img.isFeatured) || null,
      stepCompletion: { ...formDataRef.current.stepCompletion, photos: true },
    });
  };

  const updatePrice = async (priceData: PriceData): Promise<void> => {
    updateFormData({
      ...priceData,
      stepCompletion: { ...formDataRef.current.stepCompletion, price: true },
    });
  };
  const saveDraft = async () => {
    if (!session) {
      ToastService.error('You must be logged in to save a draft.');
      return;
    }

    const finalData = formDataRef.current;

    try {
      const formData = new FormData();
      formData.append('name', finalData.itemTitle || '');
      formData.append('price', finalData.price || '0');
      formData.append('charityProfit', finalData.charityProfit || '0');
      formData.append('category', finalData.selectedCategory || '');
      formData.append('subcategory', finalData.selectedSubCategory || '');
      formData.append('condition', finalData.condition || '');
      formData.append('brand', finalData.brand || '');
      formData.append('material', finalData.material || '');
      formData.append('color', finalData.color || '');
      formData.append('size', finalData.size || '');
      formData.append('weight', finalData.weight || '');
      formData.append('dimensions', JSON.stringify(finalData.dimensions || []));
      formData.append('additionalInfo', finalData.additionalInfo || '');
      formData.append('selectedCharityName', finalData.charityName || '');
      formData.append('selectedCharityId', finalData.charityId || '');
      formData.append('status', 'DRAFT'); // Save as draft
      // Charity handling for USER role
      if (session.user.role === 'USER' && !finalData.charityId) {
        ToastService.error('You must select a charity to save the product.');
        return;
      }
      if (session.user.role === 'USER') {
        formData.append('charity', finalData.charityId);
      }

      finalData.images.forEach(image => {
        formData.append('images', image.file);
      });
      console.log('Payload being sent as draft:', formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        ToastService.success('Product saved as draft!');
      } else {
        ToastService.error('Failed to save the product as draft.');
      }
    } catch (error) {
      console.error('Error saving product as draft:', error);
      ToastService.error(
        'An error occurred while saving the product as draft.'
      );
    }
  };

  const handleFinalSubmit = async () => {
    if (!session) {
      ToastService.error('You must be logged in to submit a product.');
      return;
    }

    const finalData = formDataRef.current;

    if (finalData.images.length === 0) {
      ToastService.error('Please upload at least one image.');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', finalData.itemTitle);
      formData.append('price', finalData.price.replace(/[^\d.-]/g, '')); // Strip non-numeric characters
      formData.append(
        'charityProfit',
        finalData.charityProfit.replace(/[^\d.-]/g, '')
      ); // Strip non-numeric characters
      formData.append('category', finalData.selectedCategory);
      formData.append('subcategory', finalData.selectedSubCategory || '');
      formData.append('condition', finalData.condition || '');
      formData.append('brand', finalData.brand || '');
      formData.append('material', finalData.material || '');
      formData.append('color', finalData.color || '');
      formData.append('size', finalData.size || '');
      formData.append('weight', finalData.weight || '');
      formData.append('dimensions', JSON.stringify(finalData.dimensions || []));
      formData.append('additionalInfo', finalData.additionalInfo || '');
      formData.append('selectedCharityName', finalData.charityName || '');
      formData.append('selectedCharityId', finalData.charityId || '');
      formData.append('status', 'LIVE');
      // Charity handling for USER role
      if (session.user.role === 'USER' && !finalData.charityId) {
        ToastService.error('You must select a charity to save the product.');
        return;
      }
      if (session.user.role === 'USER') {
        formData.append('charity', finalData.charityId);
      }

      // Append files
      finalData.images.forEach(image => {
        formData.append('images', image.file);
      });
      console.log('Payload being sent as draft:', formData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        ToastService.success('Product created successfully!');
        setIsModalOpen(true);
      } else {
        ToastService.error('Failed to create the product.');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      ToastService.error('An error occurred while creating the product.');
    } finally{
       setIsSubmitting(false);
    }
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

  const closeModal = () => {
    setIsModalOpen(false);
    router.push('/'); // Navigate to home on cancel (can replace with account page path in future)
  };

  const confirmAnotherPost = () => {
    formDataRef.current = initialFormData; // Reset to initial data
    setActiveTab('details'); // Go back to details
    setIsModalOpen(false); // Close the modal
  };

  const userRole = session?.user?.role;

  return (
    <div className="max-w-[590px] m-auto pt-4 pb-[111px] sm:pb-18">
      <div className="flex sm:flex-col gap-5">
        <div className="sm:w-full sm:px-4 w-full max-w-[183px] sm:max-w-full sticky sm:relative top-8 sm:pt-8 sm:top-0 sm:pb-6  h-[30vh] sm:h-auto">
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
              hideCharitySelection={userRole === 'CHARITY'}
              onSaveAsDraft={saveDraft}
            />
          )}
          {activeTab === 'photos' && (
            <PhotosForm
              setActiveTab={setActiveTab}
              onSubmit={updateImages}
              images={formDataRef.current.images}
              onBack={() => handleBack('photos')}
              onSaveAsDraft={saveDraft}
            />
          )}
          {activeTab === 'price' && (
            <PriceForm
              isSubmitting={isSubmitting}
              setActiveTab={setActiveTab}
              onSubmit={updatePrice}
              onBack={() => handleBack('price')}
              onFinish={handleFinalSubmit}
              formData={formDataRef.current}
              onSaveAsDraft={saveDraft}
            />
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmAnotherPost}
      />
     
    </div>
  );
};

export default SellAnItem;
