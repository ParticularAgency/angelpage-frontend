import React from "react";

const Select = ({ label, name, value, onChange, options, className }) => {
  return (
    <div className={`select-field ${className}`}>
      <label className="font-secondary text-body-form font-normal leading-[150%] text-mono-100" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="border !bg-transparent p-2 w-full text-body-caption font-normal leading-[150%] font-secondary text-mono-100 focus:text-mono-100 visited:text-mono-100 focus-visible:text-mono-100"
      >
        {options.map((option, index) => (
          <option className="text-body-caption font-normal leading-[150%] font-secondary text-mono-60 focus:text-mono-100 visited:text-mono-100 focus-visible:text-mono-100" key={index} value={option.value}>
            {option.label}
          </option> 
        ))}
      </select>
    </div>
  );
};

export default Select;
