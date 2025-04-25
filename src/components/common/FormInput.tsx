import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
// import { NepaliDatePicker } from "nepali-datepicker-reactjs";
// import Nepali from "nepalify-react";
import "../../App.css";


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

const FormInput: React.FC<InputProps> = ({
  label,
  className = "",
  InputClassName = "",
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
  labelClassName = "",
  lang = "en",
}) => {
  const [inputValue, setInputValue] = useState<string>(value?.toString() || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPositionRef = useRef<number | null>(null);

  // Update local state when prop value changes
  useEffect(() => {
    setInputValue(value?.toString() || "");
  }, [value]);

  // Restore cursor position after render
  useEffect(() => {
    if (inputRef.current && cursorPositionRef.current !== null) {
      inputRef.current.setSelectionRange(
        cursorPositionRef.current,
        cursorPositionRef.current
      );
      cursorPositionRef.current = null;
    }
  });

  // Memoize the input styles
  const nepaliInputStyle = useMemo(() => (
    lang === "np" ? { fontSize: "22px", lineHeight: "1.1" } : {}
  ), [lang]);

  // Memoize classnames
  const inputClassNames = useMemo(() => (
    `w-full outline-none flex-1 px-2 py-2 ${lang === "np" ? "preeti-font" : ""}`
  ), [lang]);

  const containerClassNames = useMemo(() => (
    `w-full flex flex-col gap-1.5 ${className}`
  ), [className]);

  const borderClassNames = useMemo(() => (
    `w-full flex items-center px-1 bg-white rounded-lg border ${
      error ? "border-red-500" : "border-zinc-300"
    } ${InputClassName}`
  ), [error, InputClassName]);

  // Handle input change with cursor position preservation
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    cursorPositionRef.current = e.target.selectionStart;
    setInputValue(e.target.value);
    onChange?.(e);
  }, [onChange]);

  // Handle text pasting with proper cursor positioning
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

  // Handle date change for Nepali date picker
  const handleDateChange = useCallback((dateValue: string) => {
    onChange?.({
      target: { name, value: dateValue },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [name, onChange]);

  // Handle unicode value change
  const handleUnicodeChange = useCallback((event: any, unicodeValue: string) => {
    onChange?.({
      target: { name, value: unicodeValue },
    } as React.ChangeEvent<HTMLInputElement>);
    return {};
  }, [name, onChange]);

  // Render label component if needed
  const renderLabel = () => {
    if (!label) return null;
    
    return (
      <label
        className={`text-gray-700 text-sm font-bold flex items-center gap-1 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
    );
  };

  // Render the appropriate input based on type and language
  const renderInput = () => {
    // if (type === "date" && lang === "np") {
    //   return (
    //     <div className="relative w-full px-4">
    //       <NepaliDatePicker
    //         inputClassName="w-full outline-none flex-1 px-2 py-2"
    //         className="w-full"
    //         value={value ? (value as string) : undefined}
    //         onChange={handleDateChange}
    //         options={{ calenderLocale: "ne", valueLocale: "en" }}
    //       />
    //       <svg
    //         className="w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
    //         fill="none"
    //         stroke="currentColor"
    //         viewBox="0 0 24 24"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth={2}
    //           d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    //         />
    //       </svg>
    //     </div>
    //   );
    // }

    return (
      <input
        ref={inputRef}
        type={type}
        onPaste={handlePaste}
        onChange={handleChange}
        readOnly={readOnly}
        name={name}
        value={inputValue}
        placeholder={placeholder}
        className={inputClassNames}
        lang={lang}
        style={nepaliInputStyle}
      />
    );
  };

  // Render unicode input if needed
  // const renderUnicode = () => {
  //   if (lang !== "unicode") return null;
    
  //   return (
  //     <div className="w-full flex-1 px-2 py-2">
  //       <Nepali
  //         funcname="unicodify"
  //         value={value as string}
  //         inputType={type as "text" | "textarea"}
  //         initialValue={value as string}
  //         valueChange={handleUnicodeChange}
  //       />
  //     </div>
  //   );
  // };

  return (
    <div className={containerClassNames}>
      {renderLabel()}
      <div className={borderClassNames}>
        {iconPosition === "start" && children && (
          <span className="text-gray-500 h-full flex items-center justify-center w-auto">
            {children}
          </span>
        )}

        {renderInput()}
        {/* {renderUnicode()} */}

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

export default React.memo(FormInput);