import React from "react";
import { useGallery } from "./useGallery";
import { MediaProps } from "./ChooseFromGallery";

interface DropZoneProps {
  onClick: () => void;
  activeTab?: "ne" | "en";
  setMedia: React.Dispatch<
    React.SetStateAction<MediaProps[] | MediaProps | null>
  >;
  isMultiple?: boolean;
}

const DropZone = ({
  onClick,
  activeTab,
  setMedia,
  isMultiple,
}: DropZoneProps) => {
  const { handleDrop, handleDragOver } = useGallery();

  return (
    <div
      onDrop={(event) => {
        handleDrop(event, setMedia, isMultiple);
      }}
      onDragOver={handleDragOver}
      data-type="media"
      className="drop-zone flex flex-col gap-1 rounded-lg border-dashed border-2 bg-gray-50 w-full mx-auto justify-center items-center h-40 my-3"
    >
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClick}
          className="hover:bg-transparent"
        >
          <span className="text-red-600 font-semibold capitalize text-sm">
            select from gallery
          </span>
        </button>
      </div>
      <span className="text-gray-400 text-sm">
        {activeTab === "en"
          ? "Select your file from here, we accept images, videos"
          : "यहाँबाट तपाईंको फाइल चयन गर्नुहोस्, हामी छविहरू, भिडियोहरू स्वीकार गर्दछौं।"}
      </span>
    </div>
  );
};

export default DropZone;
