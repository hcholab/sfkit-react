import { createContext, useEffect, useState } from "react";
import { AuthProvider } from "react-oidc-context";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppConfig, getAppConfig } from "./appConfig";
import Footer from "./components/Footer";
import { IdleStatusMonitor } from "./components/IdleStatusMonitor";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import Profile from "./pages/Profile";
import Studies from "./pages/Studies";
import Tutorials from "./pages/Tutorials";
import Workflows from "./pages/Workflows";
import CreateStudy from "./pages/studies/CreateStudy";
import Study from "./pages/studies/Study";
import "./static/css/study.css";

export const AppContext = createContext({
  apiBaseUrl: "",
});

const App: React.FC = () => {
  const [appConfig, setAppConfig] = useState<AppConfig>();
  useEffect(() => {
    getAppConfig().then(setAppConfig);
  }, []);

  const Layout = () => (
    <div className="App d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Outlet />
      </div>
      <IdleStatusMonitor />
      <Footer />
    </div>
  );

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/profile/:userId", element: <Profile /> },
    { path: "/workflows", element: <Workflows /> },
    { path: "/instructions", element: <Instructions /> },
    { path: "/tutorials", element: <Tutorials /> },
    { path: "/studies", element: <Studies /> },
    { path: "/studies/create_study", element: <CreateStudy /> },
    { path: "/studies/:study_id/:auth_key?", element: <Study /> },
    { path: "/contact", element: <Contact /> },
    { path: "*", element: <Layout /> },
  ]);

  return (
    appConfig && (
      <AuthProvider {...appConfig.auth}>
        <AppContext.Provider value={{ ...appConfig }}>
          <RouterProvider router={router} />
        </AppContext.Provider>
      </AuthProvider>
    )
  );
};

export default App;
