interface ModalProps {
  handleHomeClick: (activeSection: string) => void;
  handleLibraryClick: (activeSection: string) => void;
  handleUploadNewClick: (activeSection: string) => void;
}

const ModalSidebar: React.FC<ModalProps> = ({
  handleLibraryClick,
  handleUploadNewClick,
  handleHomeClick,
}) => {
  return (
    <>
      <div className="w-[25%] hover:bg-white overflow-auto hidden-scroll rounded-bl-[20px] p-6 pb-4 bg-[#f5f5f5] flex flex-col justify-between gap-9">
        <div className="flex flex-col gap-6">
          <span
            className="text-sm text-[#414651] pl-2 font-semibold cursor-pointer"
            onClick={() => handleHomeClick("home")}
          >
            Home
          </span>
          <div className="flex flex-col">
            <span
              className="text-sm font-semibold p-2 hover:bg-white rounded-md pl-2 cursor-pointer text-[#252B37]"
              onClick={() => handleLibraryClick("library")}
            >
              Library
            </span>
            <span
              className="text-sm font-semibold p-2 hover:bg-white rounded-md pl-2 cursor-pointer text-[#252B37]"
              onClick={() => handleUploadNewClick("uploadNew")}
            >
              Upload New
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalSidebar;
