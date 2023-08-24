import { MsalProvider } from "@azure/msal-react";
import * as React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { msalInstance } from "./msalConfig";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Instructions from "./pages/Instructions";
import Tutorials from "./pages/Tutorials";
import Workflows from "./pages/Workflows";
import "./static/css/study.css";

const App: React.FC = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navbar />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </MsalProvider>
  );
};

export default App;
