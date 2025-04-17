import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useUserStore } from "./stores/tokenStore"; // Assuming you have this store for user profile
import { privateRoutes } from "./routes/privateRoutes"; // Define your private routes
import { publicRoutes } from "./routes/publicRoutes"; // Define your public routes
import TopBar from "./components/common/layouts/TopBar";
import Sidebar from "./components/common/layouts/Sidebar";
import { ToastContainer } from "react-toastify";

function App() {
  const { userProfile } = useUserStore();

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* If the user is authenticated (token exists), allow access to private routes */}
        {userProfile?.token && (
          <Route
            path="/*"
            element={
              <Routes>
                {privateRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <>
                        <div className="flex h-screen w-screen bg-primary_bg ">
                          {/* Sidebar - Fixed Width */}
                          <Sidebar />

                          {/* Main Content Area */}
                          <div className="w-10/12 flex flex-col  ">
                            <TopBar />

                            {/* Page Content */}
                            <main className="w-full flex-1 overflow-auto  rounded-xl bg-white mt-20">
                              {element}
                            </main>
                          </div>
                        </div>
                      </>
                    }
                  />
                ))}
              </Routes>
            }
          />
        )}

        {/* If the user is NOT authenticated, redirect to login */}
        {!userProfile?.token && (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
