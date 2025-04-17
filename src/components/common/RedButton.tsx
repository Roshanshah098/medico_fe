import Button, { ButtonProps } from "./Button";

const RedButton = ({
  style,
  action,
  text,
  type,
  icon,
  className,
  loading,
  loadingPosition,
  disable,
  loadingText,
  iconPosition,
}: ButtonProps) => {
  return (
    <div>
      <Button
        type={type}
        text={text}
        action={action}
        style={style}
        icon={icon}
        iconPosition={iconPosition}
        loading={loading}
        loadingPosition={loadingPosition}
        disable={disable}
        loadingText={loadingText}
        className={`  bg-red-600 rounded-lg shadow border border-red-700 hover:bg-red-700 text-white text-center items-center flex  text-base font-semibold ${
          className ? className : "h-12 px-4 py-2"
        }`}
      />
    </div>
  );
};

export default RedButton;
