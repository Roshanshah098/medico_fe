import React, { useState, useEffect, useRef, useCallback } from "react";
import { Icons } from "@/assets/icons";
import { debounce } from "lodash";

interface Option {
  value: string;
  label: string;
}

interface Button {
  value: string;
  label: string;
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
  loadMore?: boolean;
  handleLoadMore?: () => void;
  dataFetchFn?: (key?: string) => Promise<Option[] | undefined>;
}

const CustomDropdown = ({
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
  loadMore = false,
  error,
  handleLoadMore,
  dataFetchFn,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    isMulti
      ? Array.isArray(value)
        ? value
        : []
      : value
      ? [value as string]
      : []
  );
  const [searchQuery, setSearchQuery] = useState("");
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

  // Fetch items on mount or when search term changes
  const debouncedFetchItems = useCallback(
    debounce((key?: string) => {
      fetchItems(key);
    }, 500),
    [fetchItems]
  );

  useEffect(() => {
    debouncedFetchItems(searchQuery);
  }, [searchQuery, debouncedFetchItems]);

  // Sync selectedOptions with the value prop
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
      if (selectedOptions.includes(optionValue)) {
        setSelectedOptions([]); // Unselect
        onChange(""); // Unselect value
        setIsOpen(false);
      } else {
        setSelectedOptions([optionValue]); // Select
        onChange(optionValue); // Select value
        setIsOpen(false);
      }
    }
  };

  const getDisplayValue = () => {
    if (buttons && buttons.length > 0) {
      const selectedButton = buttons.find((button) =>
        selectedOptions.includes(button.value)
      );

      if (selectedButton) {
        return (
          <div className="flex items-center gap-2">
            {selectedButton.icon && (
              <span className="w-5 h-5 flex items-center justify-center">
                {typeof selectedButton.icon === "string" ? (
                  <img
                    src={selectedButton.icon}
                    alt="button icon"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  selectedButton.icon
                )}
              </span>
            )}
            <span>{selectedButton.label}</span>
          </div>
        );
      }
    }

    const selectedLabels = selectedOptions
      .map(
        (value) =>
          (options || buttons || items)?.find((opt) => opt.value === value)
            ?.label
      )
      .filter(Boolean);

    if (selectedOptions.length === 0) {
      return placeholder;
    }

    if (selectedLabels.length === 0) {
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

  const filteredOptions = items?.filter((item) =>
    item.label?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative w-full`} ref={dropdownRef}>
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-gray-700 text-sm font-bold flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {icon ? (
          <>
            <div
              className={`w-full cursor-pointer gap-3 focus:border-transparent rounded-lg text-[#1b1e24] text-[16px] flex items-center justify-between text-sm bg-white border ${
                error ? " border-red-500" : "border-gray-300"
              } ${className}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {typeof icon === "string" ? (
                <img
                  src={icon}
                  alt="dropdown icon"
                  className="w-5 h-5 object-contain"
                />
              ) : (
                icon
              )}
            </div>
          </>
        ) : (
          <div
            className={`w-full cursor-pointer gap-3 focus:border-transparent rounded-lg  text-[16px] flex items-center justify-between px-3 py-2 text-sm bg-white border ${
              error ? " border-red-500" : "border-gray-300"
            } ${className}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span
              className={`capitalize text-gray-700 text-base font-normal truncate`}
            >
              {getDisplayValue()}
            </span>
            <Icons.AngleDown
              className={`w-4 h-4 transition-transform duration-200 text-gray-500 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
        )}
      </div>

      {/* Error message display */}
      {error && <span className="text-red-500 text-xs ">{error}</span>}

      {isOpen && (
        <>
          <div
            className={`absolute z-10 min-w-44 max-w-full mt-1 bg-white border rounded-lg shadow-lg max-h-[35vh] overflow-y-auto ${
              dropdownPosition === "center"
                ? "right-1/2"
                : dropdownPosition === "end"
                ? "right-0"
                : "left-0"
            } ${dropDownClass}`}
          >
            {showSearch && (
              <div className="h-9 px-2 m-1 bg-neutral-100 rounded-lg justify-between items-center flex gap-2 mb-2">
                <Icons.Search
                  fontSize="small"
                  className="text-sm text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Search "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow text-sm text-gray-500 bg-transparent outline-none"
                />
              </div>
            )}

            {isLoading ? (
              <div className="w-full px-4 py-2 text-xs text-gray-500">
                Loading.....
              </div>
            ) : (
              <>
                {(filteredOptions && filteredOptions.length > 0) ||
                (buttons && buttons.length > 0) ? (
                  <>
                    {filteredOptions?.length > 0 &&
                      filteredOptions?.map((option) => (
                        <div
                          key={option.value}
                          className={` w-full   px-4 py-2 text-sm capitalize cursor-pointer flex items-center justify-start ${
                            selectedOptions.includes(option.value)
                              ? "bg-blue-50 text-blue-600 font-semibold"
                              : "text-gray-900 hover:bg-gray-100"
                          }`}
                          onClick={() => handleOptionClick(option.value)}
                        >
                          <span>{option.label}</span>
                        </div>
                      ))}

                    {options && buttons && (
                      <div className=" w-full flex border "></div>
                    )}

                    {buttons && buttons.length > 0 && (
                      <div>
                        {buttons.map((button) => (
                          <div
                            key={button.value}
                            className={`w-full   px-4 py-2 text-sm capitalize  cursor-pointer flex items-center justify-start ${
                              selectedOptions.includes(button.value)
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-gray-900 hover:bg-gray-100"
                            }`}
                            onClick={() => handleOptionClick(button.value)}
                          >
                            {button.icon && (
                              <>
                                {typeof button.icon === "string" ? (
                                  <img
                                    src={button.icon}
                                    alt="dropdown icon"
                                    className="w-5 h-5 mr-2 object-contain"
                                  />
                                ) : (
                                  <span className="mr-2">{button.icon}</span>
                                )}
                                <span>{button.label}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {loadMore &&
                      ((options && options?.length > 10) ||
                        (buttons && buttons?.length > 10)) && (
                        <div
                          className="w-full mt-2 px-4 py-2 text-xs border-t border-gray-200 cursor-pointer hover:bg-gray-100"
                          onClick={handleLoadMore}
                        >
                          <span>Load more...</span>
                        </div>
                      )}
                  </>
                ) : (
                  <div className="w-full px-4 py-2 text-xs text-gray-500">
                    No options found
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomDropdown;
