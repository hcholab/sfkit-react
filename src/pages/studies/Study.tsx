import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import StudyParticipants from "../../components/studies/StudyParticipants";
import useAuthToken from "../../hooks/useAuthToken";
import { ParameterGroup, Study as StudyType } from "../../types/study";

import { AppContext } from "../../App";
import ChatStudyTab from "../../components/studies/ChatStudyTab";
import InstructionArea from "../../components/studies/InstructionArea";
import StudyActionButtons from "../../components/studies/StudyActionButtons";
import StudyHeader from "../../components/studies/StudyHeader";
import { getDb } from "../../hooks/firebase";

const fetchStudy = async (apiBaseUrl: string, study_id: string, idToken: string) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/study?study_id=${study_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.study;
  } catch (error) {
    console.error("Failed to fetch study:", error);
  }
};

const Study: React.FC = () => {
  const { api } = useContext(AppContext);
  const navigate = useNavigate();
  const { study_id } = useParams();
  const { idToken, userId, tokenLoading, isDbInitialized } = useAuthToken();
  const [study, setStudy] = useState<StudyType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [showWaitingDiv, setShowWaitingDiv] = useState<boolean>(false);
  const [tasks, setTasks] = useState<string[]>([]);
  const [parameters, setParameters] = useState<ParameterGroup>({} as ParameterGroup);

  const [showDownloadDiv, setShowDownloadDiv] = useState<boolean>(false);
  const [showManhattanDiv, setShowManhattanDiv] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [imageLabel, setImageLabel] = useState<string>("");
  const [showFailStatus, setShowFailStatus] = useState<boolean>(false);
  const [isRestarting, setIsRestarting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleRestartStudy = async () => {
    setIsRestarting(true);

    await fetch(`${api.sfkit}/api/restart_study?study_id=${study_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    setIsRestarting(false);
  };

  const handleStartWorkflow = async () => {
    try {
      const response = await fetch(
        `${api.sfkit}/api/start_protocol?study_id=${study_id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error || "Network response was not ok");
        setShowFailStatus(true);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Workflow started:", data);
    } catch (error) {
      console.error("Failed to start workflow:", error);
    }
  };

  const handleDownloadAuthKey = async () => {
    try {
      const response = await fetch(
        `${api.sfkit}/api/download_auth_key?study_id=${study_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "auth_key.txt";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download auth key:", error);
    }
  };

  const handleDeleteStudy = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this study?");
    if (isConfirmed) {
      setIsDeleting(true);
      try {
        const response = await fetch(
          `${api.sfkit}/api/delete_study?study_id=${study_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        console.log("Study deleted successfully");
        navigate("/studies");
      } catch (error) {
        console.error("Failed to delete study:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  useEffect(() => {
    if (isDbInitialized) {
      const unsubscribe = onSnapshot(doc(getDb(), "studies", study_id ?? ""), (doc) => {
        const data = doc.data();
        const newStatus = data?.status[userId || ""] ?? "";

        setShowWaitingDiv(newStatus.includes("ready to begin sfkit"));
        setTasks(data?.tasks?.[userId] || []);
        setParameters(data?.parameters || {});
        setShowDownloadDiv(newStatus.includes("Finished protocol"));
        setShowManhattanDiv(newStatus.includes("Finished protocol"));
        setImageSrc(data?.manhattan_plot?.src || "");
        setImageLabel(data?.manhattan_plot?.label || "");

        setStatus(newStatus);
      });

      return () => unsubscribe();
    }
  }, [isDbInitialized, study_id, userId]);

  useEffect(() => {
    if (idToken) {
      const fetchAndSetStudy = async () => {
        const fetchedStudy = await fetchStudy(api.sfkit, study_id?.toString() || "", idToken);
        setStudy(fetchedStudy);
      };

      fetchAndSetStudy();
    }
  }, [api.sfkit, idToken, study_id]);

  if (tokenLoading || !study || !isDbInitialized) return <div>Loading...</div>;

  return (
    <Container className="py-5">
      <Row>
        {errorMessage && (
          <Alert variant="danger" className="mt-3">
            {errorMessage}
          </Alert>
        )}
        <Col lg={7} className="mx-auto">
          <div className="p-4 bg-light rounded text-center">
            <div className="action-buttons">
              {study.owner === userId && (
                <StudyActionButtons
                  isRestarting={isRestarting}
                  handleRestartStudy={handleRestartStudy}
                  isDeleting={isDeleting}
                  handleDeleteStudy={handleDeleteStudy}
                />
              )}
            </div>

            <Tabs defaultActiveKey="main_study" className="mt-0 pt-0 mb-3">
              <Tab eventKey="main_study" title="Main">
                <Container>
                  <StudyHeader
                    ownerName={study.owner_name}
                    created={study.created}
                    title={study.title}
                    setupConfiguration={study.setup_configuration}
                    studyType={study.study_type}
                    description={study.description}
                    study={study}
                    userId={userId}
                    idToken={idToken}
                  />
                  <StudyParticipants study={study} userId={userId} idToken={idToken} />
                  <InstructionArea
                    studyType={study.study_type}
                    demo={study.demo}
                    idToken={idToken}
                    study_id={study.study_id}
                    title={study.title}
                    personalParameters={study.personal_parameters[userId]}
                    status={status}
                    setupConfiguration={study.setup_configuration}
                    showWaitingDiv={showWaitingDiv}
                    tasks={tasks}
                    parameters={parameters}
                    showDownloadDiv={showDownloadDiv}
                    showManhattanDiv={showManhattanDiv}
                    imageSrc={imageSrc}
                    imageLabel={imageLabel}
                    showFailStatus={showFailStatus}
                    handleStartWorkflow={handleStartWorkflow}
                    handleDownloadAuthKey={handleDownloadAuthKey}
                  />
                </Container>
              </Tab>
              <Tab eventKey="chat_study" title="Chat">
                <ChatStudyTab study={study} userId={userId} idToken={idToken} />
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Study;
