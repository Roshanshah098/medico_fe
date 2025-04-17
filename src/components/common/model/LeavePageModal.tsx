import React from "react";
import Popup from "./Popup";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";


type PropsType = {
  open: boolean;
  handleClose: () => void;
};

const LeavePageModal = ({ open, handleClose }: PropsType) => {
  const navigate = useNavigate();
  return (
    <div>
      <Popup
        handleClose={handleClose}
      
        height="auto"
        open={open}
        width="640px"
        borderRadius="12px"
      >
        <div className="w-full h-[188px] bg-white  shadow-lg  flex flex-col justify-between items-center p-6">
          <div className="w-full">
           <div className="w-full flex justify-between">
           <h3 className="text-zinc-900 text-lg font-semibold mb-2">
              Leave page with unsaved changes?
            </h3>
            <span onClick={handleClose}><CloseIcon className="text-gray-600 cursor-pointer" /></span>
           </div>
            <p className="text-zinc-900 text-base">
              Leaving this page will delete all unsaved changes.
            </p>
          </div>
          <div className="flex justify-end gap-3 w-full">
            <button
              className="px-4 py-2.5 bg-white rounded-lg shadow border border-zinc-300 text-gray-700 text-base font-semibold"
              onClick={handleClose}
            >
              Stay
            </button>
            <button
              className="px-4 py-2.5 bg-red-600 rounded-lg text-white text-base font-semibold"
              onClick={() => navigate(-1)}
            >
              Leave Page
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default LeavePageModal;
