import React, { useState, useEffect, useRef } from "react";
import { Icons } from "@/assets/icons";

interface Option {
  value: string;
}

interface Button {
  value: string;
  icon?: React.ReactNode;
}

interface CustomDropdownProps {
  label?: string;
  options?: Option[];
  buttons?: Button[];
  isMulti?: boolean;
  placeholder?: string;
  icon?: React.ReactNode | string;
  onChange: (value: string | string[]) => void;
  value?: string | string[];
  className?: string;
  showSearch?: boolean;
  dropdownPosition?: "start" | "center" | "end";
  dropDownClass?: string;
  required?: boolean;
  error?: string;
}

const CustomDropdownValue = ({
  label,
  options,
  isMulti = false,
  placeholder = "Select",
  icon,
  onChange,
  value,
  className = "",
  buttons,
  showSearch = false,
  dropdownPosition,
  dropDownClass,
  required = false,
  error,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    isMulti ? (Array.isArray(value) ? value : []) : value ? [value as string] : []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMulti) {
      setSelectedOptions(Array.isArray(value) ? value : []);
    } else {
      setSelectedOptions(value ? [value as string] : []);
    }
  }, [value, isMulti]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    if (isMulti) {
      const updatedSelection = selectedOptions.includes(optionValue)
        ? selectedOptions.filter((value) => value !== optionValue)
        : [...selectedOptions, optionValue];
      setSelectedOptions(updatedSelection);
      onChange(updatedSelection);
    } else {
      setSelectedOptions([optionValue]);
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (buttons && buttons.length > 0) {
      const selectedButton = buttons.find((button) => selectedOptions.includes(button.value));
      if (selectedButton) {
        return (
          <div className="flex items-center gap-2">
            {selectedButton.icon && <span className="w-5 h-5 flex items-center justify-center">{selectedButton.icon}</span>}
            <span>{selectedButton.value}</span>
          </div>
        );
      }
    }
    return selectedOptions.length > 0 ? selectedOptions.join(", ") : placeholder;
  };

  const filteredOptions = options?.filter((item) => item.value?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="relative w-full space-y-1.5" ref={dropdownRef}>
      {label && (
        <label className="text-gray-700 text-sm font-bold flex items-center gap-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`w-full cursor-pointer rounded-lg text-[16px] flex items-center justify-between px-3 py-2 text-sm bg-white border ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="capitalize text-gray-700 text-base font-normal">{getDisplayValue()}</span>
        <Icons.AngleDown className={`w-4 h-4 transition-transform duration-200 text-gray-500 ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
      {isOpen && (
        <div
          className={`absolute z-10 min-w-44 max-w-full mt-1 bg-white border rounded-lg shadow-lg h-auto ${
            dropdownPosition === "center" ? "right-1/2" : dropdownPosition === "end" ? "right-0" : "left-0"
          } ${dropDownClass}`}
        >
          {showSearch && (
            <div className="h-9 px-2 m-1 bg-neutral-100 rounded-lg flex gap-2 mb-2 items-center">
              <Icons.Search fontSize="small" className="text-sm text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow text-sm text-gray-500 bg-transparent outline-none"
              />
            </div>
          )}
          {filteredOptions?.map((option) => (
            <div
              key={option.value}
              className={`w-full h-9 px-4 py-2 text-sm capitalize cursor-pointer flex items-center justify-start ${
                selectedOptions.includes(option.value) ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              <span>{option.value}</span>
            </div>
          ))}
          {buttons && (
            <>
              <div className="w-full flex border" />
              {buttons.map((button) => (
                <div
                  key={button.value}
                  className={`w-full h-9 px-4 py-2 text-sm capitalize cursor-pointer flex items-center justify-start ${
                    selectedOptions.includes(button.value) ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-900 hover:bg-gray-100"
                  }`}
                  onClick={() => handleOptionClick(button.value)}
                >
                  {button.icon && <span className="mr-2">{button.icon}</span>}
                  <span>{button.value}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdownValue;
