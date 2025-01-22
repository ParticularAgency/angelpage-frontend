import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/elements';
// import { ToastService } from '@/components/elements/notifications/ToastService';

const UploadCharityList = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/charity/upload-charities`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('Charity list uploaded successfully!');
      console.log('Uploaded charities:', response.data);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload the file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-charity-list p-6">
      <h2 className="h4 !text-[20px] font-primary text-mono-100">Upload charity list:</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mt-5 flex flex-col max-w-[410px]"
      >
        <div className="upload-file-area cursor-pointer flex items-center justify-center">
          <label
            htmlFor="file-upload"
            className="block body-bold-small  !text-primary-color-100 !underline text-center cursor-pointer"
          >
            <input
              type="file"
              id="file-upload"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="mt-1 hidden opacity-0 w-full body-bold-small border border-gray-300 rounded-md"
            />
            <Image
              src="/images/cloud-upload-svgrepo-com.svg"
              alt="upload file icon image"
              width={90}
              height={90}
              className="w-8 h-8 mb-1 opacity-45 mx-auto"
            />
            Brows excel file
          </label>
        </div>

        {file && (
          <p className="forms text-gray-500">
            <span className="bold">Selected file:</span> {file.name}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="max-w-[220px]"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>

      {message && (
        <p className="mt-4 body-bold-small text-green-600">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 body-bold-small text-red-600">
         {error}
        </p>
      )}
    </div>
  );
};

export default UploadCharityList;
