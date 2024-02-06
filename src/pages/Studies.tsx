import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import ChooseWorkflow from "../components/studies/ChooseWorkflow";
import DisplayStudy from "../components/studies/DisplayStudy";
import useAuthToken from "../hooks/useAuthToken";
import { Study } from "../types/study";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { getDb } from "../hooks/firebase";
import LoginButton from "../components/LoginButton";
import useGenerateAuthHeaders from "../hooks/useGenerateAuthHeaders";

const Studies: React.FC = () => {
  const { apiBaseUrl } = useContext(AppContext);
  const onTerra = apiBaseUrl.includes("broad");
  const { idToken, userId, tokenLoading } = useAuthToken();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "mine";
  });
  const [myStudies, setMyStudies] = useState<Study[] | null>(null);
  const [otherStudies, setOtherStudies] = useState<Study[] | null>(null);
  const [user, setUser] = useState<DocumentData | null>(null);
  const headers = useGenerateAuthHeaders();

  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(doc(getDb(), "users", userId), (doc) => {
        const data = doc.data();
        if (data) {
          setUser(data);
        }
      });
      return () => unsubscribe();
    }
  }, [userId]);

  useEffect(() => {
    if (!idToken) {
      return;
    }

    const fetchMyStudies = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/my_studies`, {
          headers,
        });
        const data = await response.json();
        setMyStudies(data.studies);
      } catch (error) {
        console.error("Error fetching my studies:", error);
      }
    };
    fetchMyStudies();
  }, [apiBaseUrl, idToken, headers]);

  useEffect(() => {
    const fetchPublicStudies = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/public_studies`);
        const data = await response.json();
        setOtherStudies(data.studies);
      } catch (error) {
        console.error("Error fetching public studies:", error);
      }
    };
    fetchPublicStudies();
  }, [apiBaseUrl]);

  useEffect(() => {
    if (myStudies && myStudies.length > 0) {
      setActiveTab("mine");
    } else if (otherStudies && otherStudies.length > 0) {
      setActiveTab("others");
    }
  }, [myStudies, otherStudies]);

  if (tokenLoading) {
    return <div>Loading...</div>;
  }

  if (!idToken && onTerra) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ transform: "translateY(+200%)" }}
      >
        <h2 className="mb-4">Welcome to the Studies Section</h2>
        <p className="mb-4">Please log in to view or create studies.</p>
        <LoginButton />
      </div>
    );
  }

  return (
    <section className="py-5 main-content">
      <div className="container">
        <div className="row text-center">
          <h1 className="fw-normal">Registered Studies</h1>
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
                  <div className="col-12 mt-4">
                    <p className="text-muted">You are not logged in so have no studies.</p>
                  </div>
                ) : myStudies.length === 0 ? (
                  <div className="col-12 mt-4">
                    <p className="text-muted">You are not currently participating in any studies.</p>
                  </div>
                ) : (
                  myStudies.map((study) => (
                    <DisplayStudy key={study.title} study={study} userId={userId} idToken={idToken} user={user} />
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
                    <DisplayStudy key={study.title} study={study} userId={userId} idToken={idToken} user={user} />
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
