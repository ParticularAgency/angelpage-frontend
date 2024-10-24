/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/elements';
import Image from 'next/image';
import React, { useRef } from 'react';

interface FormProps {
  setActiveTab: (tabName: string) => void;
}

const PhotosForm: React.FC<FormProps> = ({ setActiveTab }) => {
  const fileInputRef: any = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click(); // Triggers the file input when the browse button or upload box is clicked
  };

  const handleFileChange = (event: any) => {
    const files = event.target.files;
    // You can handle the selected files here, like showing a preview
    console.log(files); // This will show the selected files in the console
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header text */}
      <div>
        <span className="text-body-small text-[#474648]">
          Take photos from multiple angles to show all the details (including any flaws).
        </span>
      </div>

      {/* Photo upload section */}
      <div
        className="border-2 border-dashed border-[#C9C8CA] p-6 text-center cursor-pointer mt-[27px] mb-4"
        onClick={handleBrowseClick}
      >
        <p className="text-body-caption text-[#474648]">You can add up to 10 photos</p>
        <Button variant='accend-link' className='flex items-center underline !text-primary-color-100'>Browse</Button>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {/* Uploaded photo previews */}
      <div className="w-full mb-[19px]">
      <div className="flex">
          <div className="relative border p-2 text-center">
            <p className="text-[11px] text-mono-80"> Featured image </p>
            <div className="relative my-2">
              <Image src="/images/thumb.png" alt="Featured photo" width={82} height={82} className="w-full h-full" />
              <Image src="/images/icons/delete.svg" alt="Delete Icon" width={32} height={32} className="absolute cursor-pointer inset-0 m-auto w-8 h-8" />
            </div>

            <Image src="/images/icons/drag.svg" alt="Drag Icon" width={25} height={14} />
          </div>

          <div className="relative border p-2 text-center">
            <p className="text-[11px] text-mono-80"> Featured image </p>
            <div className="relative my-2">
              <Image src="/images/thumb.png" alt="Featured photo" width={82} height={82} className="w-full h-full" />
              <Image src="/images/icons/delete.svg" alt="Delete Icon" width={32} height={32} className="absolute cursor-pointer inset-0 m-auto w-8 h-8" />
            </div>

            <Image src="/images/icons/drag.svg" alt="Drag Icon" width={25} height={14} />
          </div>
       </div>
      </div>

      {/* Photo tip section */}
      <div className="bg-[#F1F1F7] pt-2 pl-3 pb-6 pr-[30px]">
        <p className="text-body-small text-[#474648]">
          <p className="text-primary-color-100 text-body-caption font-medium mb-2 flex gap-[10px]"><Image src="/images/icons/camera.svg" alt="Camera Icon" width={12} height={12} /> Photo tip</p> 
          For your main photo, lay the item flat by itself on a plain, contrasting colour so we can easily remove the background.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center mt-[54px]">
        <Button variant='accend-link' className='flex items-center !text-primary-color-100' onClick={() => setActiveTab('details')}>
          <Image
          width={16}
          height={16}
          src="/images/icons/arr-left.svg"
          alt="Left Arrow Icon"
          />
          Back
        </Button>
        <div className="flex sm:flex-col space-x-4">
          <Button variant='accend-link' className='flex items-center underline !text-primary-color-100' onClick={() => console.log('Should not click')}>Save as draft</Button>
          <Button type='submit' variant='primary' onClick={() => setActiveTab('price')}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default PhotosForm;
