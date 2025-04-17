import React, { useEffect, useState } from "react";
import GalleryModel from "./GalleryModal";
import MediaItem from "./MediaItem";
import DropZone from "./DropZone";

export interface MediaProps {
  _id: string;
  url: string;
  name: string;
  fileType: string;
}

interface ChooseFromGalleryProps {
  title?: string;
  mediaToDisplay: MediaProps[] | MediaProps | null;
  activeTab?: "ne" | "en";
  setMedia: React.Dispatch<
    React.SetStateAction<MediaProps[] | MediaProps | null>
  >;
  isMultiple?: boolean;
  isProfileImage?: boolean;
  maxSelect?: number;
}

const ChooseFromGallery: React.FC<ChooseFromGalleryProps> = ({
  title,
  mediaToDisplay,
  activeTab,
  setMedia,
  isMultiple,
  isProfileImage,
  maxSelect,
}) => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imagesToChoose, setImagesToChoose] = useState(0);

  const handleGalleryOpen = () => setGalleryOpen(true);
  const handleGalleryClose = () => setGalleryOpen(false);

  const handleDeleteImage = (index: number) => {
    setMedia((prev) => {
      if (isMultiple && Array.isArray(prev)) {
        return prev?.filter((_, i:number) => i !== index);
      } else {
        return null;
      }
    });
  };
  useEffect(() => {
    const imagesremaining =
      mediaToDisplay === null && maxSelect !== undefined
        ? maxSelect
        : Array.isArray(mediaToDisplay) && maxSelect !== undefined
        ? maxSelect - mediaToDisplay.length
        : 0;

    setImagesToChoose(imagesremaining);
  }, [mediaToDisplay, galleryOpen]);

  const renderProfileImageSection = () => (
    <div
      className="size-40 border rounded-lg flex items-center justify-center hover:shadow-md cursor-pointer"
      onClick={handleGalleryOpen}
    >
      <button
        type="button"
        onClick={handleGalleryOpen}
        className="hover:bg-transparent"
      >
        <span className="text-red-600 font-semibold capitalize text-sm">
          select from gallery
        </span>
      </button>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-4">
      {title && <h4 className="text-base font-semibold">{title}</h4>}

      {mediaToDisplay ? (
        Array.isArray(mediaToDisplay) && isMultiple ? (
          <>
            {mediaToDisplay.length > 0 ? (
              <div className="flex gap-8 flex-wrap">
                {mediaToDisplay.map((media, index) => (
                  <MediaItem
                    key={index}
                    media={media}
                    onDelete={() => handleDeleteImage(index)}
                  />
                ))}
                {isMultiple &&
                maxSelect !== undefined &&
                imagesToChoose <= 0 ? null : (
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="py-2 px-3 cursor-pointer shadow-lg rounded-xl font-semibold bg-gray-200 w-44 h-40 flex justify-center items-center text-7xl border capitalize border-gray-200 text-black hover:bg-black hover:text-white"
                      onClick={handleGalleryOpen}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <DropZone
                onClick={handleGalleryOpen}
                activeTab={activeTab}
                setMedia={setMedia}
                isMultiple={isMultiple}
              />
            )}
          </>
        ) : (
          <MediaItem
            media={mediaToDisplay as MediaProps}
            onDelete={() => handleDeleteImage(0)}
          />
        )
      ) : (
        <>
          {isProfileImage ? (
            renderProfileImageSection()
          ) : (
            <DropZone
              onClick={handleGalleryOpen}
              activeTab={activeTab}
              setMedia={setMedia}
              isMultiple={isMultiple}
            />
          )}
        </>
      )}

      {galleryOpen && (
        <GalleryModel
          open={galleryOpen}
          handleClose={handleGalleryClose}
          setMedia={
            setMedia as React.Dispatch<
              React.SetStateAction<MediaProps | MediaProps[]>
            >
          }
          isMultiple={isMultiple}
          maxSelect={imagesToChoose}
        />
      )}
    </div>
  );
};

export default ChooseFromGallery;
