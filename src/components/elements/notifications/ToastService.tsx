import React from 'react';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification: React.FC = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

// Define the notify function here
const notify = (message: string, options?: ToastOptions) => {
  toast(message, options);
};

// Create the ToastService with all toast methods
export const ToastService = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, options);
  },
  notify, 
};

export default ToastNotification;
