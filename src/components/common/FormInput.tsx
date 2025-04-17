import React, { useEffect, useState } from "react";

interface InputProps {
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  placeholder?: string;
  value?: string | number;
  type?: string;
  className?: string;
  InputClassName?: string;
  labelClassName?: string;
  name?: string;
  label?: string;
  iconPosition?: "start" | "end";
  required?: boolean;
  error?: string;
  style?: React.CSSProperties;
  lang?: string;
}

const FormInput = ({
  label,
  className,
  InputClassName,
  iconPosition,
  children,
  name,
  value,
  type = "text",
  onChange,
  readOnly,
  placeholder,
  required = false,
  error,
  style,
  labelClassName,
  lang = "en",
}: InputProps) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text/plain");

    if (/^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{}|;:,.<>?]*$/.test(pastedText)) {
      setInputValue(pastedText);
      onChange?.({
        target: { name, value: pastedText },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      try {
        const data = pastedText;

        setInputValue(data);
        console.log(data);
        onChange?.({
          target: { name, value: data },
        } as React.ChangeEvent<HTMLInputElement>);
      } catch (error) {
        console.error("Error converting text:", error);
      }
    }
  };

  return (
    <div className={`${className || "w-full flex flex-col gap-1.5"}  `}>
      {label && (
        <label
          className={`text-sm font-medium text-gray-700 flex items-center gap-1 ${
            labelClassName || ""
          }`}
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`w-full flex items-center px-1 bg-white rounded-lg border ${
          error ? "border-red-500" : "border-zinc-300"
        } ${InputClassName || ""}`}
      >
        {iconPosition === "start" && children && (
          <span className="text-gray-500 h-full flex items-center justify-center w-auto">
            {children}
          </span>
        )}

        <input
          type={type}
          onPaste={handlePaste}
          onChange={onChange}
          readOnly={readOnly}
          name={name}
          value={inputValue}
          placeholder={placeholder}
          className={`w-full outline-none flex-1 px-2 py-1 ${
            lang === "np" ? "preeti-font" : ""
          }`}
          lang={lang}
          style={lang === "np" ? { fontSize: "22px", lineHeight: "1.1" } : {}}
        />

        {iconPosition === "end" && children && (
          <span className="text-gray-500 h-full flex items-center justify-center w-auto min-w-fit flex-shrink-0">
            {children}
          </span>
        )}
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default FormInput;
