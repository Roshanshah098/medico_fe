const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/register",
  FORGOTPASSWORD: "/forgot-password",
  SETNEWPASSWORD:"/setNewPassword/:input",
  OTPVERIFY: "otp-verify",
  OTPVERIFYLEFT:"otp-verify/:input",
  DASHBOARD: "/dashboard",
  MYPROFILE:"/profile",
  PREDICT: "/predict",
  DOCTORS:"/doctors",
  CHATS: "/chats",
  SINGLECHAT: "/chats/:id",
  CONSULTATION: "/consultation",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  NOT_FOUND: "*",
};

export default ROUTES;
