import React from "react";

const TextInput = ({
  gridWidth,
  label,
  type,
  placeholder,
  onChange,
  required,
  inputClass,
  value,
  errorMessage,
  maxLength,
}) => {
  return (
    <>
      <div className={`form-control w-full ${gridWidth && gridWidth}`}>
        {label && (
          <label className="label">
            <span className="label-text">
              {label} {required && "*"}
            </span>
          </label>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`input ${inputClass} w-full`}
          onChange={onChange}
          required={required}
          value={value || ""}
          maxLength={maxLength}
        />
        {errorMessage && (
          <label className="label">
            <span className="label-text-alt text-red-500">{errorMessage}</span>
          </label>
        )}
      </div>
    </>
  );
};

export default TextInput;
