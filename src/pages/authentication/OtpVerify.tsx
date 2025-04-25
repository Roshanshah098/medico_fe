import { useEffect, useState } from "react";
import  {
  useEmailStore,
  useUserStore,
} from "../../stores/tokenStore";
import { otpVerify, resendOtp } from "../../services/endpoints/authService";
import { toast } from "react-toastify";
import { SpinningLoader2 } from "../../components/common/loading/SpinningLoader";
import { Icons } from "../../assets/icons";
import { useNavigate } from "react-router-dom";

interface OtpFormData {
  otp: string[];
}
const OtpVerify = () => {
  const [formData, setFormData] = useState<OtpFormData>({
    otp: Array(4).fill(""),
  });
  const navigate = useNavigate();
  const { email } = useEmailStore();
  const { setUserProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);


  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [resendTimer]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hello");
    setIsLoading(true);
    setError(null);

    const otp = formData.otp.join("");

    try {
      const payload = {
        email: email,
        otp: otp,
      };
      const response = await otpVerify(payload);

      if (response?.results?.token) {
        toast.success(response.message);
        setUserProfile(response.results);
      }
      navigate("/home");
    } catch (err: any) {
      setError(err?.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }

    console.log(error);
  };

  //resend otp
  const handleResendCode = async () => {
    try {
      const payload = {
        email: email,
        otp: "",
      };
      const response = await resendOtp(payload);
      if (response?.message) {
        toast.success(response.message);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to verify OTP. Please try again.");
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
    <div className=" h-screen flex items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl  p-8 flex flex-col gap-8  bg-white rounded-lg">
        <div className="flex flex-col mb-3 gap-2">
          <h2 className="text-2xl text-center font-bold ">Check your email</h2>
          <p className="text-center">
            We sent a verfication link to
            <p className="text-gray-600 font-semibold">
              (entered email from store here)
            </p>
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
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
            </div>
            {error && (
              <div className="text-red-500 text-sm flex justify-center items-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-red-600 p-3 rounded-lg font-semibold text-white hover:bg-red-800 hover:scale-105  transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <SpinningLoader2 />
                </>
              ) : (
                "Verify email"
              )}
            </button>
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="text-sm text-gray-600 "
                onClick={handleResendCode}
                disabled={resendTimer > 0}
              >
                Didn't receive the email?
                <span className="font-semibold hover:text-gray-800">
                  {" "}
                  Click to resend
                </span>
                {resendTimer > 0 && ` (${resendTimer}s)`}
              </button>
            </div>

            <div className="text-sm text-gray-600 flex flex-row justify-center items-center gap-2">
              <a href="/login">
                <Icons.ArrowRight className="rotate-180" />
              </a>
              <span className="font-semibold"> Back to Login</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
