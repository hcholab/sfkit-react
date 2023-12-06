import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import LoginButton from "../components/LoginButton";
import ChooseWorkflow from "../components/studies/ChooseWorkflow";
import DisplayStudy from "../components/studies/DisplayStudy";
import useAuthToken from "../hooks/useAuthToken";
import { Study } from "../types/study";

const Studies: React.FC = () => {
  const { apiBaseUrl } = useContext(AppContext);
  const { idToken, userId, tokenLoading } = useAuthToken();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "mine";
  });
  const [myStudies, setMyStudies] = useState<Study[] | null>(null);
  const [otherStudies, setOtherStudies] = useState<Study[] | null>(null);

  // const handleAnonymousLogin = async () => {
  //   const username = "a"; // generateRandomUsername(); // Implement this function
  //   const password = "b"; // generateRandomPassword(); // Implement this function

  //   try {
  //     await instance.loginPopup({
  //       ...loginRequest,
  //       username: username,
  //       password: password,
  //     });
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   }
  // };

  useEffect(() => {
    if (idToken) {
      const fetchMyStudies = async (idToken: string) => {
        try {
          const response = await fetch(`${apiBaseUrl}/api/my_studies`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          const data = await response.json();
          setMyStudies(data.studies);
        } catch (error) {
          console.error("Error fetching my studies:", error);
        }
      };
      fetchMyStudies(idToken);

      const fetchPublicStudies = async (idToken: string) => {
        try {
          const response = await fetch(`${apiBaseUrl}/api/public_studies`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });
          const data = await response.json();
          setOtherStudies(data.studies);
        } catch (error) {
          console.error("Error fetching public studies:", error);
        }
      };
      fetchPublicStudies(idToken);
    }
  }, [apiBaseUrl, idToken]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  if (tokenLoading) {
    return <div>Loading...</div>;
  }
  if (!idToken) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ transform: "translateY(+200%)" }}
      >
        <h2 className="mb-4">Welcome to the Studies Section</h2>
        <p className="mb-4">Please log in to view or create studies.</p>
        <LoginButton />
        {/* <button onClick={handleAnonymousLogin}>Proceed Anonymously</button> */}
      </div>
    );
  }

  return (
    <section className="py-5 main-content">
      <div className="container">
        <div className="row text-center">
          {myStudies && myStudies.length !== 0 ? (
            <h1 className="fw-normal">Registered Studies</h1>
          ) : (
            <h3 className="fw-normal">There are no registered studies.</h3>
          )}
        </div>

        <ChooseWorkflow />

        <div className="row py-4 text-center">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "mine" ? "active" : ""}`}
                onClick={() => setActiveTab("mine")}
                type="button"
              >
                My Studies
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "others" ? "active" : ""}`}
                onClick={() => setActiveTab("others")}
                type="button"
              >
                Public Studies
              </button>
            </li>
          </ul>

          <div className="row tab-content">
            <div className={`container tab-pane fade ${activeTab === "mine" ? "show active" : ""}`} id="mine">
              <div className="row">
                {myStudies === null ? (
                  <div>Loading...</div>
                ) : myStudies.length === 0 ? (
                  <div className="col-12 mt-4">
                    <p className="text-muted">You are not currently participating in any studies.</p>
                  </div>
                ) : (
                  myStudies.map((study) => (
                    <DisplayStudy key={study.title} study={study} userId={userId} idToken={idToken} />
                  ))
                )}
              </div>
            </div>
            <div className={`container tab-pane fade ${activeTab === "others" ? "show active" : ""}`} id="others">
              <div className="row">
                {otherStudies === null ? (
                  <div>Loading...</div>
                ) : otherStudies.length === 0 ? (
                  <div className="col-12 mt-4">
                    <p className="text-muted">There are no public studies available.</p>
                  </div>
                ) : (
                  otherStudies.map((study) => (
                    <DisplayStudy key={study.title} study={study} userId={userId} idToken={idToken} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Studies;
