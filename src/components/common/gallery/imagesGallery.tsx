import React from "react";
import { useImageStore } from "../../../store/galleryStore";
import { useGallery } from "./useGallery";

interface ImagesGalleryProps {
  handleSelection: (index: number) => void;
  selectedID?: number[];
}

const ImagesGallery: React.FC<ImagesGalleryProps> = ({
  handleSelection,
  selectedID,
}) => {
  const { gallery } = useImageStore();
  const { handleDeleteImage } = useGallery();

  return (
    <div className="grid grid-cols-5 gap-4 mt-3 pb-20 ">
      {gallery.map((img, i) => (
        <div key={i} className="flex relative">
          <div
            onClick={() => handleSelection(i)}
            className={`bg-[#f5f5f5] transition-transform duration-300 ease-in-out ${
              selectedID?.includes(i)
                ? "border-2 border-green-600  "
                : "border-2 border-transparent"
            } cursor-pointer relative  rounded-lg aspect-square group `}
          >
            {/* delete button */}
            <div className="hidden group-hover:flex duration-200 absolute top-0  group-hover:right-0 right-full  bottom-0  ">
              <div className="h-6 w-6  rounded-full flex justify-center items-center ">
                <button
                  className=" absolute size-8 top-2 right-0 text-black text-lg bg-red-400 rounded-full hover:bg-red-600   hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  onClick={() => handleDeleteImage(i)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 14 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.66667 4.00016V3.46683C9.66667 2.72009 9.66667 2.34672 9.52134 2.06151C9.39351 1.81063 9.18954 1.60665 8.93865 1.47882C8.65344 1.3335 8.28007 1.3335 7.53333 1.3335H6.46667C5.71993 1.3335 5.34656 1.3335 5.06135 1.47882C4.81046 1.60665 4.60649 1.81063 4.47866 2.06151C4.33333 2.34672 4.33333 2.72009 4.33333 3.46683V4.00016M5.66667 7.66683V11.0002M8.33333 7.66683V11.0002M1 4.00016H13M11.6667 4.00016V11.4668C11.6667 12.5869 11.6667 13.147 11.4487 13.5748C11.2569 13.9511 10.951 14.2571 10.5746 14.4488C10.1468 14.6668 9.58677 14.6668 8.46667 14.6668H5.53333C4.41323 14.6668 3.85318 14.6668 3.42535 14.4488C3.04903 14.2571 2.74307 13.9511 2.55132 13.5748C2.33333 13.147 2.33333 12.5869 2.33333 11.4668V4.00016"
                      stroke="#fff"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {selectedID?.includes(i) && (
              <div className="flex  absolute right-1/2 translate-x-1/2  -translate-y-1/2     z-[100]">
                <div className="h-6 w-6 bg-white rounded-full flex justify-center items-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="green"
                      stroke-width="2"
                      fill="none"
                    />
                    <path
                      d="M8 12L11 15L16 9"
                      stroke="green"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            )}

            {img.fileType.includes("video") && (
              <video
                src={img.url}
                className="w-full h-full rounded-lg object-cover"
                autoPlay
                muted
              />
            )}
            {img.fileType.includes("image") && (
              <img
                src={img.url}
                alt="images"
                className="w-full h-full rounded-lg object-cover"
              />
            )}

            {img.fileType.includes("application") && (
              <div className="h-full w-full flex flex-col justify-center items-center">
              
                  <img
                    src="/icons/document.svg"
                    alt=""
                    className="w-16 h-16 object-cover"
                    />
                    <h3 className="text-xs text-center px-0.5 text-gray-600 overflow-hidden text-tranculate">
                      {img.name.split(' ').length === 1 
                        ? img.name.length > 10 
                          ? img.name.slice(0, 10) + '...' + img.name.slice(-5)
                          : img.name 
                        : img.name.split(' ').slice(0, 2).join(' ') + '... ' + img.name.split(' ').slice(-2).join(' ')}
                    </h3>

                </div>
         
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImagesGallery;
