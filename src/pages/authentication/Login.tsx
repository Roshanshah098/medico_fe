import { useEffect, useState } from "react";
import { useEmailStore, useUserStore } from "../../stores/tokenStore";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/common/FormInput";
import PasswordInput from "../../components/common/PasswordInput";
import RedButton from "../../components/common/RedButton";
import { loginApi } from "../../services/endpoints/authService";
import { toast } from "react-toastify";

interface FormErrors {
  email?: string;
  password?: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const { email } = useEmailStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { setUserProfile } = useUserStore();

  useEffect(() => {
    if (email) {
      setFormData((prev) => ({
        ...prev,
        email: email,
      }));
    }
  }, [email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await loginApi(formData);

      if (response) {
        toast.success("login successfully");
        setUserProfile(response);
        navigate("/dashboard");
      } else {
        toast.error(response.message || "Invalid response from server");
      }
    } catch (error: any) {
      if (error.response?.data) {
        toast.error(error.response.data?.detail);
      } else {
        toast.error(error.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg">
        <div className="p-6 sm:p-8 md:p-10 space-y-8">
          {/* Header Section */}
          {/* <div className="flex items-start gap-4">
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src="/logo.svg"
                alt="NTUC logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900">
                Nepal Trade Union Congress
              </h1>
              <p className="text-base text-gray-700 mt-1">
                नेपाल ट्रेड युनियन काँग्रेस
              </p>
            </div>
          </div> */}

          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="text-base text-gray-600">
              Please enter your details to sign in
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              InputClassName="h-11"
              required
              error={errors.email}
            />

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              InputClassName="h-11"
              required
              error={errors.password}
            />

            <div className="flex items-center justify-end">
              <a
                href="/forgot-password"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <RedButton
              text="Sign In"
              className="h-11 w-full text-base font-semibold"
              disable={loading}
              loading={loading}
              loadingPosition="back"
            />
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
