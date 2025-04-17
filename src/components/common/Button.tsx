"use client";
import { motion } from "framer-motion";

import { SpinningLoader2 } from "./loading/SpinningLoader";

export type ButtonProps = {
  action?: (e: React.FormEvent) => void;
  text?: string;
  icon?: React.ReactNode | string;
  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
  loadingPosition?: "front" | "back";
  iconPosition?: "front" | "back";
  loadingText?: string;
  disable?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
};

function Button({
  style,
  action,
  type,
  text,
  icon,
  iconPosition = "front",
  className = "",
  loading = false,
  loadingPosition = "back",
  disable = false,
  loadingText = "Loading...",
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.8 }}
      animate={{ opacity: disable || loading ? 0.6 : 1 }}
      disabled={disable || loading}
      style={style}
      className={`rounded-lg text-base border border-gray-300 flex items-center text-center justify-center gap-2 px-4 py-2 transition-all duration-150 cursor-pointer ${className}`}
      onClick={action}
      type={type}
    >
      {loading && loadingPosition === "front" && <SpinningLoader2 />}
      {icon &&
        iconPosition === "front" &&
        (typeof icon === "string" ? (
          <img src={icon} alt="icon" className="h-5 w-5" />
        ) : (
          <span className="icon-wrapper">{icon}</span>
        ))}
      {loading ? loadingText : text}
      {icon &&
        iconPosition === "back" &&
        (typeof icon === "string" ? (
          <img src={icon} alt="icon" className="h-5 w-5" />
        ) : (
          <span className="icon-wrapper">{icon}</span>
        ))}{" "}
      {loading && loadingPosition === "back" && <SpinningLoader2 />}
    </motion.button>
  );
}

export default Button;
