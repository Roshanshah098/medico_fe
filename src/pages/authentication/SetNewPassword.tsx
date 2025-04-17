import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  forgetPassowrd,
  resendOtp,
  setNewPassword,
} from "../../services/endpoints/authService";
import { toast } from "react-toastify";
import FormInput from "../../components/common/FormInput";
import RedButton from "../../components/common/RedButton";
import { Icons } from "../../assets/icons";
import PasswordInput from "../../components/common/PasswordInput";
import { useUserStore } from "../../stores/tokenStore";

interface OtpFormData {
  otp: string[];
  password: string;
  confirmPassword: string;
}

const SetNewPassoword = () => {
  const [formData, setFormData] = useState<OtpFormData>({
    otp: Array(4).fill(""),
    password: "",
    confirmPassword: "",
  });
  const { input } = useParams();
  const decodedInput =
    typeof input === "string" ? decodeURIComponent(input) : "";
  const { setUserProfile } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [resendTimer, setResendTimer] = useState(0);

  const router = useNavigate();

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [resendTimer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //to handle change for otp input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedOtp = [...prev.otp];
      updatedOtp[index] = value.slice(0, 1);
      return { ...prev, otp: updatedOtp };
    });

    // Move focus to next input
    if (value !== "" && index < formData.otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && formData.otp[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const validateForm = () => {
    const { password, otp, confirmPassword } = formData;
    let errors: any = {};

    // Validate Permanent Address
    if (!password) errors.password = "Password is required.";
    if (password != confirmPassword)
      errors.confirmPassword = "Password and Conform Password donot match";
    if (!otp || otp.some((otpValue) => otpValue === ""))
      errors.otp = "OTP is required.";

    setErrors(errors);
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const otp = formData.otp.join("");

    try {
      const payload = {
        email: decodedInput,
        otp: otp,
        password: formData.password,
      };
      const response = await setNewPassword(payload);

      if (response?.results?.token) {
        toast.success(response.message);
        setUserProfile(response.results);
        router("/dashboard");
      }
    } catch (err: any) {
      const errors = err?.response?.data?.error;

      if (Array.isArray(errors)) {
        errors.forEach((errorMsg: string) => toast.error(errorMsg));
      } else {
        toast.error(
          err?.message || "Failed to verify your details. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }

    console.log(errors);
  };

  //resend otp
  const handleResendCode = async () => {
    try {
      const payload = {
        otp: decodedInput,
      };
      const response = await resendOtp(payload);
      if (response?.message) {
        toast.success(response.message);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to verify OTP. Please try again.");
    }
    setResendTimer(30);
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const pasteData = e.clipboardData.getData("text");
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setFormData((prev) => ({
        ...prev,
        otp: newOtp,
      }));
      newOtp.forEach((digit, index) => {
        document.getElementById(`otp-${index}`)?.focus();
      });
    }
    e.preventDefault();
  };

  return (
    <div className="w-full flex items-center  justify-center ">
      <div className="w-full max-w-xl flex flex-col gap-8 items-center justify-center h-screen ">
        {/* Welcome Section */}
        <div className="w-full flex flex-col justify-center text-center gap-3 ">
          <h2 className="text-3xl font-semibold text-zinc-900">
            Set new Password
          </h2>
          <p className="text-base text-gray-600">
            Your new passowrd must be different from previous used passwords.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4  bg-white  "
        >
          <div className="flex flex-col gap-4">
            <div className="w-full flex justify-center space-x-2">
              {formData.otp.map((otpValue, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  name={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  autoComplete="off"
                  required
                  className="w-16 h-16 text-center  border-red-600 text-4xl font-bold text-red-600 border-2 rounded-lg focus:outline-none"
                  value={otpValue}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                />
              ))}
            </div>
            <PasswordInput
              label="Password"
              name="password"
              placeholder=""
              onChange={handleInputChange}
              InputClassName="h-11"
              required={true}
              error={errors?.password}
            />
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder=""
              onChange={handleInputChange}
              InputClassName="h-11"
              required={true}
              error={errors?.confirmPassword}
            />
          </div>

          {/* <p className="flex flex-row items-center justify-start gap-2">
            <FormInput
              type="checkbox"
              className="bg-gray-300 rounded-full p-1 text-white"
            />
            <span>Must be at least 8 characters</span>{" "}
          </p>
          <p className="flex flex-row items-center justify-start gap-2">
            <FormInput
              type="checkbox"
              className="bg-gray-300 rounded-full p-1 text-white"
            />{" "}
            <span> Must contain one special character</span>
          </p> */}

          <RedButton
            text="Reset Password"
            className="h-11 w-full flex items-center text-center justify-center"
            disable={loading}
            loading={loading}
            loadingPosition="back"
          />
        </form>

        {/* Footer */}
        <div className="text-sm text-gray-600 flex flex-row justify-center items-center gap-2">
          <a href="/login">
            <Icons.ArrowRight className="rotate-180" />
          </a>
          <span className="font-semibold"> Back to Login</span>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassoword;
