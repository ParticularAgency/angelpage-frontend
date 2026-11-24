'use client';
import { Button } from '@/components/elements';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSession } from 'next-auth/react';
import {
  ToastService,
} from '@/components/elements/notifications/ToastService';
import AiAssistButton from '@/components/ai/AiAssistButton';
import { analyzeProductImage } from '@/lib/aiApi';
interface UploadedImage {
  id: number;
  src: string;
  file: File;
  isFeatured: boolean;
}
interface FormProps {
  setActiveTab: (tabName: 'details' | 'photos' | 'price') => void;
  onSubmit: (images: UploadedImage[]) => void;
  images: UploadedImage[];
  videos?: UploadedVideo[];
  onVideosChange?: (videos: UploadedVideo[]) => void;
  onSaveAsDraft: () => void;
  onBack: () => void;
  onAiDetailsApplied?: (data: Record<string, string>) => void;
  onGoToDetails?: () => void;
  isEditMode?: boolean;
}

interface UploadedVideo {
  id: number;
  src: string;
  file: File;
}

interface UploadedImage {
  id: number;
  src: string;
  isFeatured: boolean;
}

const PhotosForm: React.FC<FormProps> = ({
  setActiveTab,
  onSubmit,
  onSaveAsDraft,
  images = [],
  videos = [],
  onVideosChange,
  onBack,
  onAiDetailsApplied,
  onGoToDetails,
  isEditMode = false,
}) => {
  const { data: session } = useSession() || {};
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(images);
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>(videos);
  const [error, setError] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setUploadedImages(images || []);
  }, [images]);

  useEffect(() => {
    setUploadedVideos(videos || []);
  }, [videos]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleAiFromPhoto = async () => {
    const featured = uploadedImages.find(img => img.isFeatured) || uploadedImages[0];
    if (!featured?.file) {
      ToastService.error('Upload a photo first.');
      return;
    }
    if (!session?.token) {
      ToastService.error('Please log in to use AI assist.');
      return;
    }
    setAiLoading(true);
    try {
      const result = await analyzeProductImage(featured.file, session.token);
      onAiDetailsApplied?.({
        itemTitle: result.title || result.suggestedTitle || '',
        brand: result.brand || '',
        color: result.color || '',
        material: result.material || '',
        condition: result.condition || '',
        size: result.size || '',
        category: result.category || '',
        subcategory: result.subcategory || '',
        additionalInfo: result.additionalInfo || result.suggestedDescription || '',
      });
      ToastService.success('AI identified your product — review details.');
      onGoToDetails?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || 'AI image analysis failed.';
      ToastService.error(msg);
    } finally {
      setAiLoading(false);
    }
  };

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  const MAX_SIZE = 5 * 1024 * 1024;
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 400;

  if (files) {
    const fileList = Array.from(files);
    for (const file of fileList) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        setError('Only JPG, PNG, or WebP images are allowed.');
        ToastService.error('Only JPG, PNG, or WebP images are allowed.');
        return;
      }
      if (file.size > MAX_SIZE) {
        setError('Each image must be under 5MB.');
        ToastService.error('Each image must be under 5MB.');
        return;
      }
    }

    const validateDimensions = (file: File) =>
      new Promise<boolean>(resolve => {
        const img = new window.Image();
        img.onload = () => {
          resolve(img.width >= MIN_WIDTH && img.height >= MIN_HEIGHT);
          URL.revokeObjectURL(img.src);
        };
        img.onerror = () => resolve(false);
        img.src = URL.createObjectURL(file);
      });

    Promise.all(fileList.map(validateDimensions)).then(results => {
      if (results.some(valid => !valid)) {
        setError('Images must be at least 400×400 pixels.');
        ToastService.error('Images must be at least 400×400 pixels.');
        return;
      }

      const newImages = fileList.map(file => ({
        id: Date.now() + Math.random(),
        src: URL.createObjectURL(file),
        file,
        isFeatured: uploadedImages.length === 0,
      }));

      const updatedImages = [...uploadedImages, ...newImages].slice(0, 10);
      setUploadedImages(updatedImages);
      onSubmit(updatedImages);
      setError('');
    });
  }
};

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024;
    if (!files) return;

    const fileList = Array.from(files);
    for (const file of fileList) {
      if (!file.type.startsWith('video/')) {
        ToastService.error('Only video files are allowed.');
        return;
      }
      if (file.size > MAX_VIDEO_SIZE) {
        ToastService.error('Each video must be under 50MB.');
        return;
      }
    }

    const newVideos = fileList.map(file => ({
      id: Date.now() + Math.random(),
      src: URL.createObjectURL(file),
      file,
    }));
    const updated = [...uploadedVideos, ...newVideos].slice(0, 2);
    setUploadedVideos(updated);
    onVideosChange?.(updated);
  };

  const handleDeleteVideo = (videoId: number) => {
    const updated = uploadedVideos.filter(v => v.id !== videoId);
    setUploadedVideos(updated);
    onVideosChange?.(updated);
  };

 const handleDeleteImage = (imageId: number) => {
   const updatedImages = uploadedImages.filter(image => image.id !== imageId);
   setUploadedImages(updatedImages);

   if (
     !updatedImages.some(image => image.isFeatured) &&
     updatedImages.length > 0
   ) {
     updatedImages[0].isFeatured = true;
     setUploadedImages([...updatedImages]);
   }
 };

 const moveImage = (dragIndex: number, hoverIndex: number) => {
   const draggedImage = uploadedImages[dragIndex];
   const updatedImages = [...uploadedImages];
   updatedImages.splice(dragIndex, 1);
   updatedImages.splice(hoverIndex, 0, draggedImage);
   setUploadedImages(updatedImages);
 };

  const handleDropToFeatured = (imageId: number) => {
    const updatedImages = uploadedImages.map(image =>
      image.id === imageId
        ? { ...image, isFeatured: true }
        : { ...image, isFeatured: false }
    );
    setUploadedImages(updatedImages);
    ToastService.success('Updated featured image.');
  };
 const handleSubmit = () => {
   if (uploadedImages.length === 0) {
     setError('Please upload at least one image.');
     ToastService.error('Please upload at least one image.');
     return;
   }

   // Ensure each uploaded image has the file object for backend processing
   if (!isEditMode && !uploadedImages.every(image => image.file)) {
     ToastService.error('Some images are missing their file data.');
     return;
   }

   onSubmit(uploadedImages);
   setActiveTab('price');
 };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col w-full">
          <div>
            <p className="font-primary text-3xl text-[#0B0112]">Photos</p>
            <span className="mt-2 block text-sm leading-6 text-[#5C5560]">
              Take photos from multiple angles, including any flaws.
            </span>
          </div>
          <div
            className="mb-4 mt-6 cursor-pointer rounded-3xl border border-dashed border-[#D8C3E4] bg-[#FCF2FF]/60 px-6 py-10 text-center"
            onClick={handleBrowseClick}
          >
            <p className="text-sm text-[#5C5560]">
              You can add up to 10 photos
            </p>
            <Button
              variant="accend-link"
              className="flex items-center underline text-primary-color-100!"
            >
              Browse
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
          {error && (
            <p className="text-error text-body-small mb-2 mt-0">{error}</p>
          )}
          {uploadedImages.length > 0 && (
            <div className="mb-4">
              <AiAssistButton
                label="✨ AI identify product from photo"
                loading={aiLoading}
                className="text-primary-color-100!"
                onClick={handleAiFromPhoto}
              />
              <p className="caption text-mono-70 mt-1">
                Uses your featured photo to suggest title, category, and description.
              </p>
            </div>
          )}

          <div className="w-full mb-[19px]">
            {uploadedImages.length > 0 ? (
              <div className="flex gap-4 flex-wrap">
                {uploadedImages.map((image, index) => (
                  <DraggableImage
                    key={image.id}
                    image={image}
                    index={index}
                    onDelete={handleDeleteImage}
                    moveImage={moveImage}
                    onDropToFeatured={handleDropToFeatured}
                  />
                ))}
              </div>
            ) : (
              <p>No images uploaded.</p>
            )}
          </div>

          <div className="mt-6 mb-4">
            <p className="font-primary text-2xl text-[#0B0112]">Product video</p>
            <span className="body-small text-[#474648]">
              Add up to 2 short clips (MP4/WebM, max 50MB each).
            </span>
            <div
              className="mt-3 cursor-pointer rounded-2xl border border-dashed border-[#D8C3E4] p-4 text-center"
              onClick={() => videoInputRef.current?.click()}
            >
              <Button
                variant="accend-link"
                className="underline text-primary-color-100!"
              >
                Upload video
              </Button>
              <input
                type="file"
                ref={videoInputRef}
                accept="video/mp4,video/webm,video/quicktime"
                multiple
                className="hidden"
                onChange={handleVideoChange}
              />
            </div>
            {uploadedVideos.length > 0 && (
              <ul className="mt-3 space-y-2">
                {uploadedVideos.map(video => (
                  <li
                    key={video.id}
                    className="flex items-center justify-between text-sm border rounded-sm px-3 py-2"
                  >
                    <span className="truncate">{video.file.name}</span>
                    <button
                      type="button"
                      className="text-[#D10C3B] text-xs"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-[#FCF2FF] px-4 py-4">
            <p className="text-body-small text-[#474648]">
              <span className="text-primary-color-100 text-body-caption font-medium mb-2 flex gap-[10px]">
                <Image
                  src="/images/icons/camera.svg"
                  alt="Camera Icon"
                  width={12}
                  height={12}
                />
                Photo tip
              </span>
              For your main photo, lay the item flat by itself on a plain,
              contrasting color so we can easily remove the background.
            </p>
          </div>
          <div className="flex justify-between items-center mt-[54px]">
            <Button
              variant="accend-link"
              className="flex items-center text-primary-color-100!"
              onClick={onBack}
            >
              <Image
                width={16}
                height={16}
                src="/images/icons/arr-left.svg"
                alt="Left Arrow Icon"
              />
              Back
            </Button>
            <div className="flex sm:flex-col space-x-4">
              <Button
                variant="accend-link"
                className="flex items-center underline text-primary-color-100!"
                onClick={onSaveAsDraft}
              >
                Save as draft
              </Button>
              <Button type="button" variant="primary" onClick={handleSubmit}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </DndProvider>
     
    </>
  );
};

interface DraggableImageProps {
  image: UploadedImage;
  index: number;
  onDelete: (id: number) => void;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onDropToFeatured: (id: number) => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
  image,
  index,
  onDelete,
  moveImage,
  onDropToFeatured,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: 'image',
    hover(item: { index: number }) {
      if (!ref.current) return;
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  const [, drag] = useDrag({
    type: 'image',
    item: { index },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="relative border p-2 text-center">
      <p className="text-[11px] text-mono-80">
        {image.isFeatured ? 'Featured image' : 'Gallery image'}
      </p>
      <div className="relative my-2">
        <Image
          src={image.src}
          alt="Uploaded photo"
          width={82}
          height={82}
          className="w-[82px] h-[82px] object-cover"
        />
        <Image
          src="/images/icons/delete.svg"
          alt="Delete Icon"
          width={32}
          height={32}
          className="absolute cursor-pointer inset-0 m-auto w-8 h-8"
          onClick={() => onDelete(image.id)}
        />
      </div>
      <Image
        src="/images/icons/drag.svg"
        alt="Drag Icon"
        width={25}
        height={14}
        onClick={() => !image.isFeatured && onDropToFeatured(image.id)}
        className={`cursor-pointer ${image.isFeatured ? 'opacity-50' : ''}`}
      />
    </div>
  );
};

export default PhotosForm;
