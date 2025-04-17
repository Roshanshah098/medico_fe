import React from "react";

interface CustomToggleButtonProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  labelPosition?: "left" | "right";
}

const CustomToggleButton: React.FC<CustomToggleButtonProps> = ({
  isChecked,
  onChange,
  label,
  disabled = false,
  className = "",
  labelClassName = "",
  labelPosition = "left",
}) => {
  return (
    <label
      className={`inline-flex items-center cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {label && labelPosition === "left" && (
        <span
          className={`mr-3 text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
        </span>
      )}

      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400
            ${isChecked ? "bg-blue-600" : "bg-gray-200"}
          `}
        />
        <div
          className={`
            absolute left-0.5 top-0.5
            w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out
            ${isChecked ? "transform translate-x-5" : "transform translate-x-0"}
          `}
        />
      </div>
      {label && labelPosition === "right" && (
        <span
          className={`ml-3 text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default CustomToggleButton;
