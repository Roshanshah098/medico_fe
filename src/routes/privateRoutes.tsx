import ROUTES from "./routes";
import Home from "../pages/home/Home";
import PredictionPage from "../pages/prediction/PredictionPage";
import Dashboard from "../pages/dashboard/Dashboard";
import ConsultationPage from "../pages/consultation/ConsultationPage";
import Chats from "../pages/chat/Chats";
import SingleChat from "../pages/chat/SingleChat";
import Profile from "../pages/page";

export const privateRoutes = [
  { path: ROUTES.PREDICT, element: <PredictionPage /> },
  { path: ROUTES.CHATS, element: <Chats /> },
  { path: ROUTES.SINGLECHAT, element: <SingleChat /> },
  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
  { path: ROUTES.CONSULTATION, element: <ConsultationPage /> },
  { path: ROUTES.DOCTORS, element: <Dashboard /> },
  { path: ROUTES.MYPROFILE, element: <Profile /> },


  { path: ROUTES.DASHBOARD, element: <Dashboard /> },
];
