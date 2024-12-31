'use client';
import React, { forwardRef, useState } from 'react';

interface InputProps {
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'checkbox'
    | 'radio'
    | 'file';
  label?: string;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  checked?: boolean;
  className?: string;
  status?: 'default' | 'error' | 'success';
  errorMessage?: string;
  inputClasses?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder = '',
      value = '',
      onChange,
      label,
      name,
      id,
      required = false,
      disabled = false,
      checked,
      className = '',
      status = 'default',
      errorMessage,
      inputClasses,
      onFocus, // Accept onFocus and onBlur as props
      onBlur,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const getStatusBorderColor = () => {
      if (isFocused) {
        return '#0B0112'; // Focus color
      }
      if (typeof value === 'string' && value.trim() !== '') {
        return '#0B0112'; // Filled color
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

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(event); // Call onFocus if provided
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(event); // Call onBlur if provided
    };

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
          ref={ref}
          className={`${inputClasses} ${status} input-field h-10 py-[11px] px-[8px] w-full text-body-caption font-normal leading-[150%] font-secondary text-mono-60 focus:text-mono-100 visited:text-mono-100 focus-visible:text-mono-100 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            border: `1px solid ${getStatusBorderColor()}`,
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
  }
);

// Add display name for the component
Input.displayName = 'Input';

export default Input;
