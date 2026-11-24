'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import DetailsForm from './forms/DetailsForm';
import PhotosForm from './forms/PhotosForm';
import PriceForm from './forms/PriceForm';
import TabNavigation from './navigation/TabNavigation';
import ConfirmationModal from './forms/popupModal';
import {
  defaultSocialPostingPrefs,
  type SocialPostingPrefs,
} from '@/components/product/SocialPostingToggles';
import {
  resolveCategoryId,
  resolveSubcategoryId,
} from '@/lib/aiApi';
import {
  ToastService,
} from '@/components/elements/notifications/ToastService';
import PreLoader from '@/components/common/pre-loader/PreLoader';
import { calculateProfitSplit } from '@/lib/profitSplit';
import { getAccountPathForRole } from '@/utils/navigationPaths';

const stripDimensionValue = (value?: string | null) => {
  if (!value) return '';
  return String(value).replace(/(in|cm)$/i, '');
};

const emptyFilePlaceholder = () =>
  new File([new Blob([''])], 'existing-image.jpg', { type: 'image/jpeg' });

const listingsAccountPath = (session: {
  user?: { id?: string; role?: string; charityId?: string };
} | null) => {
  const base = getAccountPathForRole(
    session?.user?.role,
    session?.user?.id,
    session?.user?.charityId
  );
  if (base.startsWith('/user/account') || base.startsWith('/charity/account')) {
    return `${base}?tab=listings`;
  }
  return base;
};

interface UploadedImage {
  id: number;
  src: string;
  file: File;
  isFeatured: boolean;
}
interface Dimensions {
  height?: string;
  width?: string;
  depth?: string;
}
interface UploadedVideo {
  id: number;
  src: string;
  file: File;
}
interface SellItemFormData {
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
  videos: UploadedVideo[];
  dimensions: Dimensions;
  featuredImage: UploadedImage | null;
  price: string;
  charityProfit: string;
  sellerSharePercent: number;
  sellerProfit: string;
  fulfillmentType: 'uk_shipping' | 'personal_delivery' | 'self_collect' | 'local_only';
  sellAreas: string[];
  socialPosting: SocialPostingPrefs;
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
  fulfillmentType?: 'uk_shipping' | 'personal_delivery' | 'self_collect' | 'local_only';
  sellAreas?: string[];
  dimensions?: Dimensions;
}

interface PriceData {
  price: string;
  charityProfit?: string;
  sellerSharePercent?: number;
  sellerProfit?: string;
}

const SellAnItem: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editProductId = searchParams?.get('edit');
  const { data: session } = useSession() || {};
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'price'>(
    'details'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(Boolean(editProductId));
  const isEditMode = Boolean(editProductId);

  const initialSellItemFormData: SellItemFormData = {
    charityId: '',
    charityName: '',
    itemTitle: '',
    condition: '',
    brand: '',
    material: '',
    size: '',
    weight: '',
    dimensions: { height: '', width: '', depth: '' },
    additionalInfo: '',
    color: '',
    selectedCategory: 'Select',
    selectedSubCategory: 'Select',
    images: [],
    videos: [],
    featuredImage: null,
    price: '',
    charityProfit: '',
    sellerSharePercent: 0,
    sellerProfit: '',
    fulfillmentType: 'uk_shipping',
    sellAreas: [],
    socialPosting: defaultSocialPostingPrefs(),
    stepCompletion: { details: false, photos: false, price: false },
  };

  const formDataRef = useRef<SellItemFormData>(initialSellItemFormData);
  const [, bumpFormVersion] = useState(0);

  useEffect(() => {
    if (!editProductId || !session?.token) return;

    const loadProduct = async () => {
      setIsLoadingEdit(true);
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/details/${editProductId}`,
          { headers: { Authorization: `Bearer ${session.token}` } },
        );
        const product = data?.product;
        if (!product) {
          ToastService.error('Product not found.');
          router.push(listingsAccountPath(session));
          return;
        }

        const priceNum = Number(product.price) || 0;
        const sharePct = product.sellerSharePercent ?? 0;
        const split = calculateProfitSplit(priceNum, sharePct);
        const mappedImages: UploadedImage[] = (product.images || []).map(
          (img: { url: string; isFeatured?: boolean }, index: number) => ({
            id: index + 1,
            src: img.url,
            file: emptyFilePlaceholder(),
            isFeatured: Boolean(img.isFeatured) || index === 0,
          }),
        );

        formDataRef.current = {
          ...initialSellItemFormData,
          charityId: product.charity?.id || product.selectedCharityId || '',
          charityName:
            product.charity?.charityName || product.selectedCharityName || '',
          itemTitle: product.name || '',
          selectedCategory: product.category || 'Select',
          selectedSubCategory: product.subcategory || 'Select',
          condition: product.condition || '',
          brand: product.brand || '',
          material: product.material || '',
          color: product.color || '',
          size: product.size || '',
          weight: product.weight || '',
          dimensions: {
            height: stripDimensionValue(product.dimensions?.height),
            width: stripDimensionValue(product.dimensions?.width),
            depth: stripDimensionValue(product.dimensions?.depth),
          },
          additionalInfo: product.additionalInfo || '',
          images: mappedImages,
          featuredImage: mappedImages.find(img => img.isFeatured) || mappedImages[0] || null,
          price: priceNum ? `$${priceNum.toFixed(2)}` : '',
          charityProfit: `$${split.charityProfit.toFixed(2)}`,
          sellerSharePercent: sharePct,
          sellerProfit: `$${split.sellerProfit.toFixed(2)}`,
          fulfillmentType: product.fulfillmentType || 'uk_shipping',
          sellAreas: product.sellAreas || [],
          socialPosting: product.socialPosting || defaultSocialPostingPrefs(),
          stepCompletion: { details: true, photos: mappedImages.length > 0, price: priceNum > 0 },
        };
        bumpFormVersion(v => v + 1);
      } catch (error) {
        console.error('Failed to load product for edit:', error);
        ToastService.error('Could not load listing for editing.');
        router.push(listingsAccountPath(session));
      } finally {
        setIsLoadingEdit(false);
      }
    };

    loadProduct();
  }, [editProductId, session?.token, session, router]);

  const updateSellItemFormData = (newData: Partial<SellItemFormData>) => {
    formDataRef.current = { ...formDataRef.current, ...newData };
  };

  const updateDetails = (detailsData: DetailsData) => {
    updateSellItemFormData({
      ...detailsData,
      charityId: detailsData.charityId, // Update charityId as well
      stepCompletion: { ...formDataRef.current.stepCompletion, details: true },
    });
    setActiveTab('photos');
  };

  const updateImages = (newImages: UploadedImage[]) => {
    updateSellItemFormData({
      images: newImages,
      featuredImage: newImages.find(img => img.isFeatured) || null,
      stepCompletion: { ...formDataRef.current.stepCompletion, photos: true },
    });
  };

  const updateVideos = (newVideos: UploadedVideo[]) => {
    updateSellItemFormData({ videos: newVideos });
  };

  const updatePrice = async (priceData: PriceData): Promise<void> => {
    updateSellItemFormData({
      ...priceData,
      stepCompletion: { ...formDataRef.current.stepCompletion, price: true },
    });
  };

  const updateSocialPosting = (socialPosting: SocialPostingPrefs) => {
    updateSellItemFormData({ socialPosting });
  };

  const appendSocialPosting = (uploadForm: globalThis.FormData, data: SellItemFormData) => {
    const videoUrl = data.videos?.[0]?.src || data.socialPosting.tiktokVideoUrl || '';
    const socialPayload = {
      ...data.socialPosting,
      tiktokVideoUrl: data.socialPosting.tiktokVideoUrl || videoUrl,
    };
    uploadForm.append('socialPosting', JSON.stringify(socialPayload));
  };

  const appendListingMeta = (uploadForm: globalThis.FormData, data: SellItemFormData) => {
    uploadForm.append('sellerSharePercent', String(data.sellerSharePercent ?? 0));
    uploadForm.append('fulfillmentType', data.fulfillmentType || 'uk_shipping');
    uploadForm.append('sellAreas', JSON.stringify(data.sellAreas || []));
  };

  const buildEditPayload = (finalData: SellItemFormData, status?: string) => {
    const payload: Record<string, unknown> = {
      name: finalData.itemTitle,
      price: parseFloat(finalData.price.replace(/[^\d.-]/g, '') || '0'),
      category: finalData.selectedCategory,
      subcategory: finalData.selectedSubCategory || '',
      condition: finalData.condition || '',
      brand: finalData.brand || '',
      material: finalData.material || '',
      color: finalData.color || '',
      size: finalData.size || '',
      weight: finalData.weight || '',
      dimensions: finalData.dimensions || {},
      additionalInfo: finalData.additionalInfo || '',
      selectedCharityName: finalData.charityName || '',
      selectedCharityId: finalData.charityId || '',
      sellerSharePercent: finalData.sellerSharePercent ?? 0,
      fulfillmentType: finalData.fulfillmentType || 'uk_shipping',
      sellAreas: finalData.sellAreas || [],
      socialPosting: {
        ...finalData.socialPosting,
        tiktokVideoUrl:
          finalData.socialPosting.tiktokVideoUrl ||
          finalData.videos?.[0]?.src ||
          '',
      },
    };
    if (status) payload.status = status;
    if (session?.user?.role === 'USER' && finalData.charityId) {
      payload.charity = finalData.charityId;
    }
    return payload;
  };

  const handleEditSubmit = async () => {
    if (!session || !editProductId) return;

    const finalData = formDataRef.current;
    if (finalData.images.length === 0) {
      ToastService.error('Please keep at least one product image.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${editProductId}`,
        buildEditPayload(finalData),
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        ToastService.success('Listing updated successfully!');
        const slug = response.data?.product?.slug;
        router.push(slug ? `/product/${slug}` : listingsAccountPath(session));
      }
    } catch (error) {
      console.error('Error updating product:', error);
      ToastService.error('Failed to update the listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = async () => {
    if (!session) {
      ToastService.error('You must be logged in to save a draft.');
      return;
    }

    const finalData = formDataRef.current;

    if (isEditMode && editProductId) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${editProductId}`,
          buildEditPayload(finalData, 'DRAFT'),
          {
            headers: {
              Authorization: `Bearer ${session.token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        ToastService.success('Draft saved!');
      } catch (error) {
        console.error('Error saving draft:', error);
        ToastService.error('Failed to save draft.');
      }
      return;
    }

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
      formData.append('dimensions', JSON.stringify(finalData.dimensions || {}));
      formData.append('additionalInfo', finalData.additionalInfo || '');
      formData.append('selectedCharityName', finalData.charityName || '');
      formData.append('selectedCharityId', finalData.charityId || '');
      appendListingMeta(formData, finalData);
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
      finalData.videos?.forEach(video => {
        formData.append('videos', video.file);
      });
      appendSocialPosting(formData, finalData);
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

    if (isEditMode) {
      await handleEditSubmit();
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
      formData.append('dimensions', JSON.stringify(finalData.dimensions || {}));
      formData.append('additionalInfo', finalData.additionalInfo || '');
      formData.append('selectedCharityName', finalData.charityName || '');
      formData.append('selectedCharityId', finalData.charityId || '');
      appendListingMeta(formData, finalData);
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
      finalData.videos?.forEach(video => {
        formData.append('videos', video.file);
      });
      appendSocialPosting(formData, finalData);
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
        ToastService.success('Product listed successfully!');
        setIsModalOpen(true);
        const productId = response.data?.product?._id;
        const productSlug = response.data?.product?.slug;
        if (productSlug) {
          sessionStorage.setItem('lastListedProductSlug', productSlug);
        } else if (productId) {
          sessionStorage.setItem('lastListedProductSlug', productId);
        }
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
    updateSellItemFormData({ stepCompletion: newStepCompletion });

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
    const lastProductSlug = sessionStorage.getItem('lastListedProductSlug');
    if (lastProductSlug) {
      sessionStorage.removeItem('lastListedProductSlug');
      router.push(`/product/${lastProductSlug}`);
    } else {
      router.push(listingsAccountPath(session));
    }
  };

  const confirmAnotherPost = () => {
    formDataRef.current = initialSellItemFormData; // Reset to initial data
    setActiveTab('details'); // Go back to details
    setIsModalOpen(false); // Close the modal
  };

  const applyAiToDetails = (
    data: Partial<DetailsData> & { category?: string; subcategory?: string },
  ) => {
    const catId =
      (data.selectedCategory && data.selectedCategory !== 'Select'
        ? data.selectedCategory
        : null) || resolveCategoryId(data.category);
    const subId =
      catId &&
      ((data.selectedSubCategory && data.selectedSubCategory !== 'Select'
        ? data.selectedSubCategory
        : null) ||
        resolveSubcategoryId(catId, data.subcategory));

    updateSellItemFormData({
      ...data,
      selectedCategory: catId || formDataRef.current.selectedCategory,
      selectedSubCategory: subId || formDataRef.current.selectedSubCategory,
    });
    setActiveTab('details');
  };

  const userRole = session?.user?.role;

  if (isLoadingEdit) {
    return <PreLoader />;
  }

  return (
    <div className="bg-[#FCF2FF] pb-20 pt-8 sm:pb-12">
      <div className="custom-container">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#611192]">
          Start giving
        </p>
        <h1 className="font-primary mt-2 text-[2.6rem] leading-none text-[#0B0112]">
          {isEditMode ? 'Edit your listing' : 'List an item'}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#5C5560]">
          Three steps. Add the item, show it clearly, then choose how much of the sale supports a charity.
        </p>
      </div>
      <div className="custom-container mt-8 grid grid-cols-12 items-start gap-6 sm:grid-cols-1">
        <div className="col-span-4 sm:col-span-full">
          <div className="rounded-3xl border border-[#E6E3E7] bg-white p-3">
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            stepCompletion={formDataRef.current.stepCompletion}
          />
          {!isEditMode && (
          <Link
            href="/product/bulk-list"
            className="mt-3 block px-3 pb-2 text-sm text-[#611192]"
          >
            List many items at once
          </Link>
          )}
          </div>
        </div>
        <div className="col-span-8 rounded-3xl border border-[#E6E3E7] bg-white p-6 sm:col-span-full sm:p-5">
          {activeTab === 'details' && (
            <DetailsForm
              setActiveTab={setActiveTab}
              onSubmit={updateDetails}
              formData={formDataRef.current}
              hideCharitySelection={userRole === 'CHARITY'}
              onSaveAsDraft={saveDraft}
              onAiApplied={applyAiToDetails}
            />
          )}
          {activeTab === 'photos' && (
            <PhotosForm
              setActiveTab={setActiveTab}
              onSubmit={updateImages}
              images={formDataRef.current.images}
              videos={formDataRef.current.videos}
              onVideosChange={updateVideos}
              onBack={() => handleBack('photos')}
              onSaveAsDraft={saveDraft}
              onAiDetailsApplied={applyAiToDetails}
              onGoToDetails={() => setActiveTab('details')}
              isEditMode={isEditMode}
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
              socialPosting={formDataRef.current.socialPosting}
              onSocialPostingChange={updateSocialPosting}
              listingVideoUrl={formDataRef.current.videos?.[0]?.src || ''}
              isEditMode={isEditMode}
            />
          )}
        </div>
      </div>

      {!isEditMode && (
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmAnotherPost}
      />
      )}
     
    </div>
  );
};

export default SellAnItem;
