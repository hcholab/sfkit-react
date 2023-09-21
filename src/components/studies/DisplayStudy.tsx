import { Card, Button, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import { Study } from "../../types/study";
import StudyConfigBadge from "./StudyConfigBadge";

interface StudyProps {
  study: Study;
  userId: string;
  idToken: string;
}

const DisplayStudy: React.FC<StudyProps> = ({ study, userId, idToken }) => {
  const [infoModalShow, setInfoModalShow] = useState(false);
  const [joinModalShow, setJoinModalShow] = useState(false);

  const handleJoinRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/request_join_study?title=${study.title}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ message: (e.target as HTMLFormElement).message.value }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setJoinModalShow(false);
        window.location.reload();
      } else {
        console.error("Failed to request to join study:", data.message);
      }
    } catch (error) {
      console.error("Failed to request to join study:", error);
    }
  };

  return (
    <div className="col-lg-4 p-3">
      <Card bg="light">
        <Card.Body>
          <Card.Text className="text-muted mb-0">
            Created by {study.owner_name} on {new Date(study.created).toLocaleDateString()}
            {study.private && " (private)"}
          </Card.Text>

          <h4 className="h4 mb-0 d-inline-block">
            {study.participants.includes(userId) || userId === "developer" ? (
              <Card.Link href={`/studies/${study.title}`} className="text-decoration-none">
                {study.raw_title}
              </Card.Link>
            ) : (
              study.raw_title
            )}
          </h4>

          {study.study_information && (
            <>
              <Button
                variant="outline-secondary"
                size="sm"
                className="ms-1 mb-2"
                onClick={() => setInfoModalShow(true)}
              >
                <i className="bi bi-info-square"></i> Info
              </Button>

              <Modal show={infoModalShow} onHide={() => setInfoModalShow(false)} centered>
                <Modal.Header closeButton>
                  <Modal.Title>{study.raw_title} - Study Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>{study.study_information}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setInfoModalShow(false)}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}

          <StudyConfigBadge setupConfiguration={study.setup_configuration} studyType={study.study_type} />
          <Card.Text className="my-2">{study.description}</Card.Text>

          {study.invited_participants?.includes(userId) && (
            <Form action={`/studies/${study.title}/accept`} method="post">
              <Button variant="success" size="sm" type="submit">
                Accept Invitation
              </Button>
            </Form>
          )}

          {study.requested_participants && userId in study.requested_participants ? (
            <Button variant="secondary" size="sm" disabled>
              Pending Approval from Study Owner
            </Button>
          ) : (
            !study.participants.includes(userId) && (
              <>
                {study.study_type === "MPC-GWAS" && study.participants.length === 3 ? (
                  <p>(This study is full)</p>
                ) : (
                  <div>
                    <Button variant="outline-primary" size="sm" onClick={() => setJoinModalShow(true)}>
                      Request to Join Study
                    </Button>

                    <Modal show={joinModalShow} onHide={() => setJoinModalShow(false)} centered>
                      <Modal.Header closeButton>
                        <Modal.Title>
                          Request to Join <i>{study.raw_title}</i> Study
                        </Modal.Title>
                      </Modal.Header>
                      <Form onSubmit={handleJoinRequest}>
                        <Modal.Body>
                          <p className="text-muted">The creator of the study will be notified of your request.</p>
                          <Form.Group className="mb-3">
                            <Form.Label>(optional) Message</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="message"
                              placeholder="Leave a message for the study owner"
                              style={{ height: "100px" }}
                            />
                          </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={() => setJoinModalShow(false)}>
                            Close
                          </Button>
                          <Button variant="primary" type="submit">
                            Submit
                          </Button>
                        </Modal.Footer>
                      </Form>
                    </Modal>
                  </div>
                )}
              </>
            )
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DisplayStudy;
