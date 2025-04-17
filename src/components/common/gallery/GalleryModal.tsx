import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import CloseIcon from "@mui/icons-material/Close";
import ModalSidebar from "./modalSidebar";
import ImagesGallery from "./imagesGallery";
import { useImageStore } from "../../../store/galleryStore";
import { Pagination } from "@mui/material";
import TableLoading from "@/components/loading/TableLoading";
import { MediaProps } from "./ChooseFromGallery";
import { useGallery } from "./useGallery";

interface FadeProps {
  children: React.ReactElement<any>;
  in?: boolean;
  onClick?: any;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
  ownerState?: any;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
  props,
  ref
) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null as any, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null as any, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "1200px",
  height: "80vh",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export default function GalleryModel({
  open,
  handleClose,
  setMedia,
  isMultiple,
  maxSelect,
}: {
  children?: React.ReactNode;
  open: boolean;
  handleClose: () => void;
  setMedia: React.Dispatch<React.SetStateAction<MediaProps[] | MediaProps>>;
  isMultiple?: boolean;
  maxSelect?: number;
}) {
  const {
    currentPage,
    totalPage,
    loading,
    setCurrentPage,
    handleFileChange,
    handleDrop,
    handleDragOver,
  } = useGallery();

  const { gallery, setSelectedImages } = useImageStore();
  const [selectedIDs, setSelectedIDs] = React.useState<number[] | []>([]);
  const [activeSection, setActiveSection] = React.useState<
    "library" | "uploadNew" | "home"
  >("home");

  const handleLibraryClick = () => setActiveSection("library");
  const handleUploadNewClick = () => setActiveSection("uploadNew");
  const handleHomeClick = () => setActiveSection("home");

  const handleSelection = (id: number) => {
    setSelectedIDs((prevSelectedIDs) => {
      if (isMultiple) {
        if (maxSelect) {
          if (prevSelectedIDs.includes(id as never)) {
            // If the image is already selected, deselect it
            return prevSelectedIDs.filter((selectedId) => selectedId !== id);
          }
          // If the image is not selected
          if (prevSelectedIDs.length >= maxSelect) {
            // Remove the first selected image and add the new selected image
            return [...prevSelectedIDs.slice(1), id];
          }
          // If we haven't reached the limit
          return [...prevSelectedIDs, id];
        }
        // If maxSelect is not defined, toggle the selection
        return prevSelectedIDs.includes(id as never)
          ? prevSelectedIDs.filter((selectedId) => selectedId !== id)
          : [...prevSelectedIDs, id];
      }
      // If not multiple, select a single image
      return [id];
    });
  };
  const handleAddToPage = () => {
    const selectedImageUrls = selectedIDs.map((id) => gallery[id]);
    setSelectedImages(selectedImageUrls, "add");

    if (isMultiple) {
      setMedia((prev) =>
        Array.isArray(prev)
          ? [...prev, ...selectedImageUrls]
          : selectedImageUrls
      );
    } else {
      const singleImage = selectedImageUrls[0] || null;

      setMedia(singleImage);
    }

    handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
            transitionDuration: 0.2,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <div className="border-b border-b-gray-300 flex justify-between w-full p-6 pb-4">
              <span className="text-[16px] font-semibold text-[#12151C]">
                Choose an image
              </span>
              <div onClick={handleClose}>
                <CloseIcon className="text-gray-600 cursor-pointer" />
              </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <ModalSidebar
                handleLibraryClick={handleLibraryClick}
                handleUploadNewClick={handleUploadNewClick}
                handleHomeClick={handleHomeClick}
              />
              <div className="flex-1 flex flex-col   relative bg-white">
                <div className="flex-1 flex items-start hidden-scroll overflow-auto">
                  <div className="flex flex-col p-6 pb-0 w-[100%]">
                    {activeSection === "home" && (
                      <>
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          data-type="media"
                          className="drop-zone flex flex-col gap-1 rounded-lg border-dashed border-2 bg-gray-50 w-full mx-auto justify-center items-center h-40 my-3"
                        >
                          <label
                            htmlFor="media"
                            className="py-2 px-3 cursor-pointer rounded-xl font-semibold text-sm bg-gray-100 text-gray-600 border capitalize border-gray-200"
                          >
                            upload new
                            <input
                              id="media"
                              type="file"
                              className="hidden"
                              accept="image/*, video/*, application/pdf, "
                              onChange={(e) => handleFileChange(e)}
                            />
                          </label>
                          <span className="text-gray-500 text-[12px]">
                            Drag and drop your file here, we accept images,
                            videos, or 3D models
                          </span>
                        </div>

                        {loading ? (
                          <TableLoading />
                        ) : (
                          <ImagesGallery
                            handleSelection={handleSelection}
                            selectedID={selectedIDs}
                          />
                        )}
                      </>
                    )}

                    {activeSection === "library" && (
                      <>
                        {gallery.length > 0 ? (
                          <ImagesGallery
                            handleSelection={handleSelection}
                            selectedID={selectedIDs}
                          />
                        ) : (
                          <span className="flex justify-center text-gray-800 font-medium text-[16px]">
                            There is No Image. Upload the image to show.
                          </span>
                        )}
                      </>
                    )}

                    {activeSection === "uploadNew" && (
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        data-type="media"
                        className="drop-zone flex flex-col gap-1 rounded-lg border-dashed border-2 bg-gray-50 w-full mx-auto justify-center items-center h-40 my-3"
                      >
                        <label
                          htmlFor="media"
                          className="py-2 px-3 cursor-pointer rounded-xl font-semibold text-sm bg-gray-100 text-gray-600 border capitalize border-gray-200"
                        >
                          upload new
                          <input
                            id="media"
                            type="file"
                            className="hidden"
                            accept="image/*, video/*"
                            onChange={(e) => handleFileChange(e)}
                          />
                        </label>
                        <span className="text-gray-500 text-[12px]">
                          Drag and drop your file here, we accept images,
                          videos, or 3D models
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* footer */}
                <div className="absolute z-[99] w-full justify-center bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center gap-4 px-6">
                  <Pagination
                    count={totalPage}
                    page={currentPage}
                    onChange={(e, value) => setCurrentPage(value)}
                    size="large"
                    variant="text"
                    color="primary"
                    className="cursor-pointer w-full flex justify-end"
                  />
                  <div className="flex gap-4 justify-end w-full">
                    <button
                      onClick={handleClose}
                      className="py-1.5 px-3 rounded-xl bg-white text-gray-600 border capitalize border-gray-200"
                    >
                      cancel
                    </button>
                    <button
                      onClick={handleAddToPage}
                      className={`py-1.5 px-3 rounded-xl ${
                        selectedIDs.length <= 0
                          ? "bg-[#f5f5f5] text-gray-600"
                          : "bg-[#004eeb] text-white"
                      } duration-200 border capitalize border-gray-200`}
                    >
                      Add to page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
