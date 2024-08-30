import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import StudyParticipants from "../../components/studies/StudyParticipants";
import useFirestore from "../../hooks/useFirestore";
import { ParameterGroup, Study as StudyType } from "../../types/study";

import { useAuth } from "react-oidc-context";
import ChatStudyTab from "../../components/studies/ChatStudyTab";
import InstructionArea from "../../components/studies/InstructionArea";
import StudyActionButtons from "../../components/studies/StudyActionButtons";
import StudyHeader from "../../components/studies/StudyHeader";
import { getDb } from "../../hooks/firebase";
import useGenerateAuthHeaders from "../../hooks/useGenerateAuthHeaders";
import { useTerra } from "../../hooks/useTerra";

const fetchStudy = async (apiBaseUrl: string | URL, study_id: string, headers: Record<string, string>) => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/study?study_id=${study_id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error((await response.json()).error || "Unexpected error");
    }

    const data = await response.json();
    return data.study;
  } catch (error) {
    console.error("Failed to fetch study:", error);
    throw error;
  }
};

const Study: React.FC = () => {
  const { apiBaseUrl, onTerra } = useTerra();
  const navigate = useNavigate();
  const { study_id, auth_key = "" } = useParams();
  const headers = useGenerateAuthHeaders();

  const firestoreData = useFirestore();
  const { userId, isDbInitialized } = firestoreData;
  const idToken = useAuth().user?.id_token || "";

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

    await fetch(`${apiBaseUrl}/api/restart_study?study_id=${study_id}`, {
      method: "GET",
      headers,
    });

    setIsRestarting(false);
  };

  const handleStartWorkflow = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/start_protocol?study_id=${study_id}`, {
        method: "POST",
        headers,
      });

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

  const handleDownloadFile = async (url: string, fileName: string) => {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objUrl);
    } catch (err) {
      console.error(`Failed to download ${fileName}:`, err);
    }
  };

  const handleDownloadSAKey = async () => {
    const samApiUrl = `https://${apiBaseUrl.hostname.replace(/^sfkit\./, "sam.")}`;
    await handleDownloadFile(`${samApiUrl}/api/google/v1/user/petServiceAccount/key`, "service_account_key.json");
  };

  const handleDownloadAuthKey = async () => {
    await handleDownloadFile(`${apiBaseUrl}/api/download_auth_key?study_id=${study_id}`, "auth_key.txt");
  };

  const handleDeleteStudy = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this study?");
    if (isConfirmed) {
      setIsDeleting(true);
      try {
        const response = await fetch(`${apiBaseUrl}/api/delete_study?study_id=${study_id}`, {
          method: "DELETE",
          headers,
        });

        if (!response.ok) {
          throw new Error((await response.json()).error || "Unexpected error");
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
    if (isDbInitialized && study_id) {
      const unsubscribe = onSnapshot(
        doc(getDb(), "studies", study_id),
        (doc) => {
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
        },
        (err) => console.error(`read studies/${study_id} ${err}`)
      );

      return () => unsubscribe();
    }
  }, [isDbInitialized, study_id, userId]);

  useEffect(() => {
    if (idToken || auth_key) {
      const fetchAndSetStudy = async () => {
        try {
          const fetchedStudy = await fetchStudy(apiBaseUrl, study_id?.toString() || "", headers);
          setStudy(fetchedStudy);
        } catch (error) {
          if (error instanceof Error) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("An unknown error occurred.");
          }
        }
      };

      fetchAndSetStudy();
    }
  }, [idToken, auth_key, apiBaseUrl, study_id, headers]);

  if (errorMessage) return <div>{errorMessage}</div>;
  // TODO: distinguish between "not found" and "finding"
  if (!study) return <div>Study not found</div>;
  if (!study.participants.includes(userId)) return <div>Not authorized</div>;

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

            {!idToken && (
              <Alert variant="warning" className="mt-3">
                Note: you created this study anonymously. Please save the link if you would like to return.
              </Alert>
            )}

            <Tabs defaultActiveKey="main_study" className="mt-0 pt-0 mb-3">
              <Tab eventKey="main_study" title="Main">
                <Container>
                  <StudyHeader
                    ownerName={study.owner_name}
                    created={study.created}
                    title={study.title}
                    studyType={study.study_type}
                    description={study.description}
                    study={study}
                    userId={userId}
                  />
                  <StudyParticipants study={study} userId={userId} />
                  <InstructionArea
                    studyType={study.study_type}
                    demo={study.demo}
                    idToken={idToken}
                    study_id={study.study_id}
                    title={study.title}
                    personalParameters={study.personal_parameters[userId]}
                    status={status}
                    showWaitingDiv={showWaitingDiv}
                    tasks={tasks}
                    parameters={parameters}
                    showDownloadDiv={showDownloadDiv}
                    showManhattanDiv={showManhattanDiv}
                    imageSrc={imageSrc}
                    imageLabel={imageLabel}
                    showFailStatus={showFailStatus}
                    handleStartWorkflow={handleStartWorkflow}
                    handleDownloadAuthKey={onTerra ? handleDownloadSAKey : handleDownloadAuthKey}
                  />
                </Container>
              </Tab>
              <Tab eventKey="chat_study" title="Chat">
                <ChatStudyTab study={study} userId={userId} />
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Study;
