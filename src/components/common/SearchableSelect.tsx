import React, { useState, useEffect, useRef, useCallback } from "react";
import { Icons } from "@/assets/icons";
import { debounce } from "lodash";
import { BiPlus } from "react-icons/bi";
//@ts-ignore
import preeti from "preeti";
import { toast } from "react-toastify";
interface Option {
  value: string;
  label: string;
}
interface CustomDropdownProps {
  label?: string;
  onAddFn?: (title: string) => Promise<{
    value: string;
    label: string;
  }>;
  options?: Option[];
  isMulti?: boolean;
  placeholder?: string;
  icon?: React.ReactNode | string;
  onChange: (value: string | string[]) => void;
  value?: string | string[];
  className?: string;
  dropdownPosition?: "start" | "center" | "end";
  dropDownClass?: string;
  required?: boolean;
  error?: string;
  onCreateOption?: (value: string) => Promise<void>;
  dataFetchFn?: (key?: string) => Promise<Option[] | undefined>;
  language?: string;
}
const SearchableSelect = ({
  label,
  options = [],
  isMulti = false,
  placeholder = "Select",
  icon,
  onChange,
  value,
  className = "",
  dropdownPosition,
  dropDownClass,
  required = false,
  error,
  onCreateOption,
  dataFetchFn,
  onAddFn,
  language = "EN",
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Option[]>(options);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    isMulti
      ? Array.isArray(value)
        ? value
        : []
      : value
      ? [value as string]
      : []
  );
  const [isCreating, setIsCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Fetch items based on search term
  const fetchItems = useCallback(
    async (key?: string) => {
      if (!dataFetchFn && !options) return;
      setIsLoading(true);
      try {
        let data: Option[] = [];
        if (dataFetchFn) {
          data = (await dataFetchFn(key)) || [];
        } else if (options) {
          data = options;
        }
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dataFetchFn, options]
  );
  const debouncedFetchItems = useCallback(
    debounce((key?: string) => {
      fetchItems(key);
    }, 500),
    [fetchItems]
  );
  useEffect(() => {
    debouncedFetchItems(searchQuery);
  }, [searchQuery, debouncedFetchItems]);
  useEffect(() => {
    if (isMulti) {
      setSelectedOptions(Array.isArray(value) ? value : []);
    } else {
      setSelectedOptions(value ? [value as string] : []);
    }
  }, [value, isMulti]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleOptionClick = (optionValue: string, label: string) => {
    if (isMulti) {
      const updatedSelection = selectedOptions.includes(optionValue)
        ? selectedOptions.filter((value) => value !== optionValue)
        : [...selectedOptions, optionValue];
      setSelectedOptions(updatedSelection);
      onChange(updatedSelection);
    } else {
      setSelectedOptions([optionValue]);
      setSelectedLabel(label);
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    }
  };
  const getDisplayValue = () => {
    const selectedLabels = selectedOptions
      .map((value) => items?.find((opt) => opt.value === value)?.label)
      .filter(Boolean);
    if (selectedLabel) return selectedLabel;
    if (selectedOptions.length == 0 || !selectedLabels) {
      return placeholder;
    }
    return isMulti ? (
      <div className="flex items-center overflow-y-auto gap-1">
        {selectedLabels.map((txt, i) => (
          <span
            key={i}
            className="px-2 py-1 text-white rounded-md bg-blue-500 font-semibold"
          >
            {txt}
          </span>
        ))}
      </div>
    ) : (
      selectedLabels[0]
    );
  };
  const filteredOptions = items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleOptionAddFn = async () => {
    try {
      const res = await onAddFn?.(searchQuery);
      if (res) {
        setSelectedOptions([res.value]);
        setSelectedLabel(res.label);
        onChange(res.value);
        setIsOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-gray-700 text-sm font-bold flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div
          className={`w-full cursor-pointer gap-3 focus:border-transparent rounded-lg  flex items-center justify-between px-3 py-2 text-sm bg-white border ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="capitalize text-gray-700 font-normal">
            {getDisplayValue()}
          </span>
          <Icons.AngleDown
            className={`w-4 h-4 transition-transform duration-200 text-gray-500 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </div>
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
      {isOpen && (
        <div
          className={`absolute z-10 w-full mt-1 bg-white border rounded-lg border-gray-200 ${dropDownClass}`}
        >
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    language === "NP" ? preeti(e.target.value) : e.target.value
                  )
                }
                className="w-full px-8 py-2 text-sm border rounded-lg outline-none"
                placeholder="Search or create..."
                onClick={(e) => e.stopPropagation()}
              />
              <Icons.Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
            ) : (
              <>
                {searchQuery && (
                  <div className="p-2 flex justify-end border-b">
                    <button
                      type="button"
                      className="w-full max-w-max px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300"
                      onClick={async () => handleOptionAddFn()}
                      disabled={isCreating}
                    >
                      {isCreating ? (
                        "Creating..."
                      ) : (
                        <span className=" flex items-center gap-1">
                          <BiPlus />
                          Add
                        </span>
                      )}
                    </button>
                  </div>
                )}
                {filteredOptions.length > 0
                  ? filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`px-4 py-2 text-sm cursor-pointer ${
                          selectedOptions.includes(option.value)
                            ? "bg-red-50 text-red-600 font-semibold"
                            : "text-gray-900 hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          handleOptionClick(option.value, option.label)
                        }
                      >
                        {option.label}
                      </div>
                    ))
                  : !searchQuery && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No options found
                      </div>
                    )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchableSelect;
