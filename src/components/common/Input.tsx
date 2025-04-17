import React from "react";

interface InputProps {
  label?: string; // Optional label for the input
  type?: string; // Input type (e.g., text, email, password, etc.)
  value: string; // Controlled value for the input
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Change handler
  placeholder?: string; // Placeholder text
  className?: string; // Additional custom CSS classes
  error?: string; // Error message
  required?: boolean; // Whether the input is required
  disabled?: boolean; // Whether the input is disabled
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-gray-700 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default Input;
