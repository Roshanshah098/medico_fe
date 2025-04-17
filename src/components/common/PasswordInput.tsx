import React, { useState } from "react";
import { Icons } from "../../assets/icons";


interface PasswordInputProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  name?: string;
  placeholder?: string;
  InputClassName?: string;
}

const PasswordInput = ({
  label,
  value,
  onChange,
  error,
  required = false,
  name,
  placeholder = "********",
  InputClassName,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordShow = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-gray-700 text-sm font-medium flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`w-full flex items-center gap-2 px-3 py-2  bg-white rounded-lg border  ${error ? "border-red-500 " : " border-zinc-300"
          }  ${InputClassName}`}
      >
        <Icons.Lock className="text-gray-500 h-5 w-5" />

        <input
          type={showPassword ? "text" : "password"}
          onChange={onChange}
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          className="outline-none flex-1"
        />

        <span className="text-gray-500 cursor-pointer" onClick={togglePasswordShow}>
          {showPassword ? (
            <Icons.Eye className="text-gray-500 h-5 w-5" />
          ) : (
            <Icons.EyeClose className="text-gray-500 h-5 w-5" />
          )}
        </span>
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default PasswordInput;
