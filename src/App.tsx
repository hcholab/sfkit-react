import { createContext, useEffect, useState } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppConfig, getAppConfig } from './appConfig';
import Footer from "./components/Footer";
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
  api: {
    rawls: "",
    sam: "",
    sfkit: "",
  },
});

const App: React.FC = () => {
  const [appConfig, setAppConfig] = useState<AppConfig>();
  useEffect(() => { getAppConfig().then(setAppConfig) }, []);

  return appConfig && (
    <AuthProvider {...appConfig.auth}>
      <AppContext.Provider value={{ ...appConfig }}>
        <Router>
          <div className="App d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/workflows" element={<Workflows />} />
                <Route path="/instructions" element={<Instructions />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/studies" element={<Studies />} />
                <Route path="/studies/create_study" element={<CreateStudy />} />
                <Route path="/studies/:study_id" element={<Study />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </AppContext.Provider>
    </AuthProvider>
  );
};

export default App;
