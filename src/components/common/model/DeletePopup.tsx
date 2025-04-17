import React from "react";
import Popup from "./Popup";

interface DeletePopupProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  title: string;
  description?: string;
  deleteButtonText?: string;
  deletingItem?: string;
  cancelButtonText?: string;
  borderRadius?: string;
  width?: string;
  height?: string;
}

const DeletePopup: React.FC<DeletePopupProps> = ({
  open,
  handleClose,

  handleDelete,
  title,
  deletingItem,
  description,
  deleteButtonText = "Delete",
  cancelButtonText = "Cancel",
  borderRadius = "12px",
  width = "640px",
  height = "auto",
}) => {
  if (!open) return null;

  const handleDeleteItem = () => {
    handleDelete();
    handleClose();
  };

  return (
    <Popup
      handleClose={handleClose}
      height={height}
      open={open}
      title={title}
      width={width}
      borderRadius={borderRadius}
    >
      <div className="w-full px-6 py-6 space-y-6">
        <p>
          {" "}
          You are about to {deleteButtonText.toLowerCase()}{" "}
          <span className="font-semibold">{deletingItem}</span>. {description}
        </p>
        <div className="flex justify-end items-center gap-x-3 ">
          {/* Cancel button */}
          <button
            onClick={handleClose}
            className="h-11 px-4 py-2.5 bg-white rounded-lg shadow border border-zinc-300 text-base font-semibold hover:scale-105"
          >
            {cancelButtonText}
          </button>

          {/* Delete button */}
          <button
            onClick={handleDeleteItem}
            className="h-11 px-4  bg-red-600 rounded-lg shadow border-2 border-red-600 text-white text-base text-center font-semibold hover:scale-105"
          >
            {deleteButtonText}
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default DeletePopup;
