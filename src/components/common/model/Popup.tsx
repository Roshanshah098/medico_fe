import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import CloseIcon from "@mui/icons-material/Close";

interface FadeProps {
  children: React.ReactElement<any>;
  in?: boolean;
  onClick?: any;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
  ownerState?: any;
}

interface PopupProps {
  children: React.ReactNode;
  height: string;
  width: string;
  borderRadius?: string;
  title?: string;
  description?: string;
  closeIcon?: React.FC;
  triggerContent?: React.ReactNode;
  triggerClass?: string;
  open: boolean;
  handleOpen?: () => void;
  handleClose?: () => void;
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

export default function Popup({
  children,
  height,
  width,
  borderRadius,
  title,
  description,
  closeIcon: Close,
  handleClose,
  open,
}: PopupProps) {
  const popupStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    height: height,
    bgcolor: "background.paper",
    borderRadius: borderRadius || "20px",
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
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
          <Box sx={popupStyle}>
            {/* heading */}

            {title && (
              <div className="flex flex-col px-6 pt-6 pb-2 ">
                <div className=" flex justify-between w-full ">
                  <span className="text-[16px] font-semibold text-[#12151C]">
                    {title}
                  </span>

                  <div onClick={handleClose} className=" cursor-pointer">
                    {Close ? (
                      <Close />
                    ) : (
                      <CloseIcon className="text-gray-600" />
                    )}
                  </div>
                </div>
                <h3 className="flex py-1 text-gray-600 text-base font-normal ">
                  {description}
                </h3>
              </div>
            )}
            <div>{children}</div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
