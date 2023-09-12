import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import StudyConfigBadge from "../../components/studies/StudyConfigBadge";
import useAuthToken from "../../hooks/useAuthToken";
import { Study } from "../../types/study";
import StudyParticipants from "../../components/studies/StudyParticipants";
import StudyInfoModal from "../../components/studies/StudyInfoModal";
import StudyParametersModal from "../../components/studies/StudyParametersModal";

const fetchStudy = async (title: string, idToken: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/study?title=${title}`, {
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
  const navigate = useNavigate();
  const [study, setStudy] = useState<Study>();
  const { title } = useParams();
  const { idToken, userId, tokenLoading } = useAuthToken();
  const [isRestarting, setIsRestarting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRestartStudy = async () => {
    setIsRestarting(true);

    await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/restart_study?title=${title}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    setIsRestarting(false);
  };

  const handleStartWorkflow = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/start_workflow?title=${title}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // handle the response data as needed
      console.log("Workflow started:", data);
    } catch (error) {
      console.error("Failed to start workflow:", error);
    }
  };

  const handleDownloadAuthKey = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/download_auth_key?title=${title}`,
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
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/delete_study?title=${title}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

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
    if (idToken) {
      const fetchAndSetStudy = async () => {
        const fetchedStudy = await fetchStudy(title?.toString() || "", idToken);
        setStudy(fetchedStudy);
      };

      fetchAndSetStudy();
    }
  }, [idToken, title]);

  if (tokenLoading || !study) return <div>Loading...</div>;

  return (
    <Container className="py-5">
      <Row>
        <Col lg={7} className="mx-auto">
          <div className="p-4 bg-light rounded text-center">
            {/* Navigation Tabs */}
            <div className="d-flex justify-content-between">
              <Tabs defaultActiveKey="main_study">
                <Tab eventKey="main_study" title="Main">
                  {/* Main Tab Content */}
                </Tab>
                <Tab eventKey="chat_study" title="Chat">
                  {/* Chat Tab Content */}
                </Tab>
              </Tabs>

              {study.owner === userId && (
                <div className="d-inline-flex">
                  <Button
                    variant="dark"
                    size="sm"
                    className="me-2"
                    onClick={handleRestartStudy}
                    disabled={isRestarting}
                  >
                    {isRestarting ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm" role="status"></span> Deleting resources (may
                        take a minute)...
                      </>
                    ) : (
                      "Restart Study"
                    )}
                  </Button>

                  <Button variant="danger" size="sm" onClick={handleDeleteStudy} disabled={isDeleting}>
                    {isDeleting ? (
                      <>
                        <span className="spinner-grow spinner-grow-sm" role="status"></span> Deleting...
                      </>
                    ) : (
                      "Delete Study"
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="row">
              <Container>
                <div className="mt-0 mb-3">
                  <div className="mt-2">
                    <small className="text-muted">
                      Created by {study.owner_name} on {study.created}
                    </small>
                  </div>
                  <h3 className="h3 mb-0">{study.raw_title}</h3>
                  <StudyConfigBadge setupConfiguration={study.setup_configuration} studyType={study.study_type} />
                  <p className="mb-1">{study.description}</p>
                  <StudyInfoModal study={study} userId={userId} idToken={idToken} />
                  <StudyParametersModal study={study} userId={userId} idToken={idToken} />
                </div>

                {/* Participants List */}
                <StudyParticipants study={study} userId={userId} idToken={idToken} />
              </Container>

              <Container>
                {/* Instructions */}
                <div className="mt-3" id="instructions">
                  {study.status[userId] === "" ? (
                    <>
                      {study.setup_configuration === "website" ? (
                        <>
                          {/* Configure Study Modal Trigger Button */}
                          <Button variant="primary" data-bs-toggle="modal" data-bs-target="#configure_study_modal">
                            Configure Study
                          </Button>

                          {/* Configure Study Modal */}
                          <div className="modal fade" id="configure_study_modal" tabIndex={-1}>
                            <div className="modal-dialog modal-xl">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="configure_study_modal_label">
                                    Configure your {study.study_type} Study
                                  </h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body">
                                  {/* Include your Configure Study JSX or Component here */}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Begin Workflow Button */}
                          <div className="mt-2">
                            {/* Assuming you'd handle the workflow start with a function */}
                            <Button variant="success" onClick={handleStartWorkflow}>
                              Begin {study.study_type} Workflow
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-start">
                          <p>
                            Once all participants have joined the study, and you have set the 'Study Parameters', you
                            can proceed with the
                            <a
                              className="text-decoration-none"
                              href="https://sfkit.readthedocs.io/en/latest/tutorial.html#cli"
                            >
                              sfkit Command-Line Interface (CLI)
                            </a>
                            on your machine.
                          </p>
                          <p>
                            If you would like guidance on what size machine to use, see the
                            <Link className="text-decoration-none" to="/instructions">
                              Machine Recommendations
                            </Link>
                            section in the instructions page.
                          </p>

                          <p>
                            Click below to download
                            <code>auth_key.txt</code>
                            which you will need on your machine to authenticate with the sfkit command-line interface.
                            <div className="text-center">
                              {/* Assuming you'd handle the download with a function */}
                              <Button variant="primary" size="sm" onClick={handleDownloadAuthKey}>
                                Download Auth Key
                              </Button>
                            </div>
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>{/* This part would need more information about the conditions and what to show */}</div>
                  )}
                </div>
              </Container>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Study;
