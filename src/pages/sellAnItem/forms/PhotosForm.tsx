'use client';
import { Button } from '@/components/elements';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ToastNotification, {
  ToastService,
} from '@/components/elements/notifications/ToastService';
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
  onSaveAsDraft: () => void; // Handler for Save as Draft
  onBack: () => void;
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
  onBack,
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(images);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setUploadedImages(images || []);
  }, [images]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;

  if (files) {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      src: URL.createObjectURL(file),
      file, // Save the file object for later backend upload
      isFeatured: uploadedImages.length === 0,
    }));

    const updatedImages = [...uploadedImages, ...newImages].slice(0, 10);
    setUploadedImages(updatedImages);
    onSubmit(updatedImages); // Pass updated images to parent component
    setError('');
  }
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
   if (!uploadedImages.every(image => image.file)) {
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
            <p className="mb-2 body-bold-regular">Photos</p>
            <span className="body-small text-[#474648]">
              Take photos from multiple angles to show all the details
              (including any flaws).
            </span>
          </div>
          <div
            className="border-2 border-dashed border-[#C9C8CA] p-6 text-center cursor-pointer mt-[27px] mb-4"
            onClick={handleBrowseClick}
          >
            <p className="text-body-caption text-[#474648]">
              You can add up to 10 photos
            </p>
            <Button
              variant="accend-link"
              className="flex items-center underline !text-primary-color-100"
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
          <div className="bg-[#F1F1F7] pt-2 pl-3 pb-6 pr-[30px]">
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
              className="flex items-center !text-primary-color-100"
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
                className="flex items-center underline !text-primary-color-100"
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
      <ToastNotification />
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
