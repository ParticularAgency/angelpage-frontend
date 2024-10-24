import React, { useState } from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'checkbox' | 'radio' | 'file'; // Add more types as needed
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string; // Optional label for the input field
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  checked?: boolean; // For checkbox and radio
  className?: string; // Custom class for additional styling
  status?: 'default' | 'error' | 'success' | 'focus'; // New prop to indicate input status
  errorMessage?: string; // Optional error message to display
  inputClasses?: string; // Optional class styling for input
}

const Input: React.FC<InputProps> = ({
  type = 'text', // Default to 'text'
  placeholder = '',
  value,
  onChange,
  label,
  name,
  id,
  required = false,
  disabled = false,
  checked,
  className = '',
  status = 'default', // Default to 'default' status
  errorMessage,
  inputClasses
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Define border colors based on status and if the field is filled or focused
  const getStatusBorderColor = () => {
    if (isFocused) {
      return '#0B0112'; // Focus color
    }

    if (value) {
      return '#000'; // Change border color to black if field is filled
    }

    switch (status) {
      case 'error':
        return '#D10C3B'; // Red for error
      case 'success':
        return '#1FC430'; // Green for success
      default:
        return '#C9C8CA'; // Default gray color
    }
  };

  // Handle focus and blur events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`input-wrapper flex gap-2 ${className}`}>
      {label && (
        <label
          className="font-secondary text-body-form font-normal leading-[150%] text-mono-100"
          htmlFor={id || name}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        id={id}
        required={required}
        disabled={disabled}
        checked={checked}

        className={`${inputClasses}input-field h-10 py-[11px] px-[8px] w-full text-body-caption font-normal leading-[150%] font-secondary text-mono-60 focus:text-mono-100 visited:text-mono-100 focus-visible:text-mono-100 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}

        style={{
          border: `1px solid ${getStatusBorderColor()}`, // Apply the border color based on status and if the field is filled
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {status === 'error' && errorMessage && (
        <p className="error-message text-body-caption text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;
