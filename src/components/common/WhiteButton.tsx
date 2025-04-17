import Button, { ButtonProps } from "./Button";

const Whitebutton = ({
  style,
  action,
  text,
  icon,
  iconPosition,
  className,
  loading,
  loadingPosition,
  disable,
  loadingText,
  type,
}: ButtonProps) => {
  return (
    <div>
      <Button
        text={text}
        action={action}
        style={style}
        icon={icon}
        type={type}
        iconPosition={iconPosition}
        loading={loading}
        loadingPosition={loadingPosition}
        disable={disable}
        loadingText={loadingText}
        className={` bg-white rounded-lg shadow border border-zinc-300 text-gray-700 text-base font-semibold hover:bg-gray-50 ${className ? className : "h-12 px-4 py-2"}`}
      />
    </div>
  );
};

export default Whitebutton;
