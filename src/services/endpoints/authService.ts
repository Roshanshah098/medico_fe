import { api } from "../api";

interface LoginData {
  email: string;
  password: string;
 
}

export const loginApi = async (formData: LoginData) => {
  try {
    const response = await api.post("auth/login/", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

interface RegisterData {
  user_type: string;
  password: string;
  confirm_password: string;
  data: {
    email: string;
    username: string;
    name: string;
    mobile_no: string;
    gender: string;
    dob: string;
    address: string;
  };
}

export const registerApi = async (formData: RegisterData) => {
  try {
    const response = await api.post("auth/signup/", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

interface OtpData {
  otp: string;
}

export const otpVerify = async (formData: OtpData) => {
  try {
    const response = await api.post("auth/validate-otp/", formData, {});
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const resendOtp = async (formData: OtpData) => {
  try {
    const response = await api.post("/otpverify", formData, {});
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

interface ForgetPasswordData {
  email: string;
}

export const forgetPassowrd = async (formData: ForgetPasswordData) => {
  try {
    const response = await api.post("auth/request-password-reset/", formData, {});
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};


interface SetNewPassword {
  email: string;
  otp:string;
  password:string;
}

export const setNewPassword = async (formData: SetNewPassword) => {
  try {
    const response = await api.post("auth/reset-password/", formData, {});
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};
