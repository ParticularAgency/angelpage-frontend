import React from 'react';

const PhotosForm = () => {
  return (
    <div className="flex flex-col w-full space-y-4">
      <div>
        <p className="text-gray-700">
          Take photos from multiple angles to show all the details (including any flaws).
        </p>
        <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md">
          <p>You can add up to 10 photos</p>
          <button className="text-purple-600">Browse</button>
        </div>
      </div>
      {/* Photo Upload Section */}
      <div className="flex space-x-4">
        {/* Each image container */}
        <div className="border p-2 rounded-md">
          <img src="/example-image.png" alt="Uploaded photo" className="w-24 h-24 object-cover" />
          <button className="text-purple-600 mt-2">Delete</button>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button type="button" className="text-purple-600">Back</button>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md">Continue</button>
      </div>
    </div>
  );
};

export default PhotosForm;
