import React, { useState } from "react";
import PrimaryTutorial from "../components/tutorials/PrimaryTutorial";
import TwoPersonTutorial from "../components/tutorials/TwoPersonTutorial";

const Tutorials: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("primary-tutorial");

  return (
    <section className="py-5">
      <div className="container col-12 col-lg-7">
        <h2 className="mb-4 text-center fw-normal">Tutorials</h2>

        <ul className="nav nav-tabs justify-content-center mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "primary-tutorial" ? "active" : ""}`}
              id="primary-tutorial-tab"
              onClick={() => setActiveTab("primary-tutorial")}
            >
              Tutorial 1 (Quick test for one user)
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "2-person-tutorial" ? "active" : ""}`}
              id="2-person-tutorial-tab"
              onClick={() => setActiveTab("2-person-tutorial")}
            >
              Tutorial 2 (Examples with two users)
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div
            className={`tab-pane fade show ${activeTab === "primary-tutorial" ? "active" : ""}`}
            id="primary-tutorial"
            role="tabpanel"
          >
            <PrimaryTutorial />
          </div>

          <div
            className={`tab-pane fade show ${activeTab === "2-person-tutorial" ? "active" : ""}`}
            id="2-person-tutorial"
            role="tabpanel"
          >
            <TwoPersonTutorial />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tutorials;
