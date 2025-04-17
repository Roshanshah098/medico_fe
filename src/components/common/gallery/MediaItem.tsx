import React from "react";
import { MediaProps } from "./ChooseFromGallery";

interface MediaItemProps {
  media: MediaProps;
  onDelete: () => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ media, onDelete }) => (
  <div className="relative flex items-center gap-4">
    <div className="border-2 border-gray-200 p-1 my-4 w-52 relative rounded-xl group">

        
      {media?.fileType?.includes("video") ? (
        <video
          src={media.url}
          className="w-full h-48 rounded-lg object-cover"
          autoPlay
          muted
        />
      ) : media?.fileType?.includes("image") ? (
        <img
          src={media.url}
          alt="media"
          className="w-full h-48 rounded-lg object-cover"
        />
      ) : (
        <div className="h-48 w-full flex flex-col justify-center items-center">
              
        <img
          src="/icons/document.svg"
          alt=""
          className="w-16 h-16 object-cover"
          />
          <h3 className="text-xs text-center px-0.5 text-gray-600 overflow-hidden text-tranculate">
            {media?.name?.split(' ').length === 1 
              ? media.name.length > 10 
                ? media.name.slice(0, 10) + '...' + media.name.slice(-5)
                : media.name 
              : media?.name?.split(' ').slice(0, 2).join(' ') + '... ' + media?.name?.split(' ').slice(-2).join(' ')}
          </h3>

      </div>
      )}
      <button
        type="button"
        className="absolute top-2 right-0 text-black text-2xl bg-red-400 rounded-full w-6 h-8 hover:bg-black hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        onClick={onDelete}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 14 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.66667 4.00016V3.46683C9.66667 2.72009 9.66667 2.34672 9.52134 2.06151C9.39351 1.81063 9.18954 1.60665 8.93865 1.47882C8.65344 1.3335 8.28007 1.3335 7.53333 1.3335H6.46667C5.71993 1.3335 5.34656 1.3335 5.06135 1.47882C4.81046 1.60665 4.60649 1.81063 4.47866 2.06151C4.33333 2.34672 4.33333 2.72009 4.33333 3.46683V4.00016M5.66667 7.66683V11.0002M8.33333 7.66683V11.0002M1 4.00016H13M11.6667 4.00016V11.4668C11.6667 12.5869 11.6667 13.147 11.4487 13.5748C11.2569 13.9511 10.951 14.2571 10.5746 14.4488C10.1468 14.6668 9.58677 14.6668 8.46667 14.6668H5.53333C4.41323 14.6668 3.85318 14.6668 3.42535 14.4488C3.04903 14.2571 2.74307 13.9511 2.55132 13.5748C2.33333 13.147 2.33333 12.5869 2.33333 11.4668V4.00016"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
);

export default MediaItem;
