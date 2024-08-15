import { DocumentData } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../App";
import useGenerateAuthHeaders from "../../hooks/useGenerateAuthHeaders";
import { Study } from "../../types/study";
import StudyConfigBadge from "./StudyConfigBadge";

interface StudyProps {
  study: Study;
  userId: string;
  idToken: string;
  user: DocumentData | null;
}

const DisplayStudy: React.FC<StudyProps> = ({ study, userId, idToken, user }) => {
  const { apiBaseUrl } = useContext(AppContext);
  const [infoModalShow, setInfoModalShow] = useState(false);
  const [joinModalShow, setJoinModalShow] = useState(false);
  const headers = useGenerateAuthHeaders();

  const isUserParticipant = () => study.participants.includes(userId);
  const isUserInvited = () => study.invited_participants?.includes(user?.email);
  const isUserRequested = () => study.requested_participants && userId in study.requested_participants;
  const isStudyFull = () => study.study_type === "MPC-GWAS" && study.participants.length === 3;

  const handleJoinRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiBaseUrl}/api/request_join_study?study_id=${study.study_id}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: (e.target as HTMLFormElement).message.value }),
      });

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

  const renderInfoButton = () => {
    return (
      <>
        <Button variant="outline-secondary" size="sm" className="ms-1 mb-2" onClick={() => setInfoModalShow(true)}>
          <i className="bi bi-info-square"></i> Info
        </Button>

        <Modal show={infoModalShow} onHide={() => setInfoModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{study.title} - Study Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>{study.study_information}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setInfoModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const handleAcceptInvitation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiBaseUrl}/api/accept_invitation?study_id=${study.study_id}`, {
        method: "POST",
        headers,
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to accept invitation:", data.message);
      }
    } catch (error) {
      console.error("Failed to accept invitation:", error);
    }
  };

  const renderAcceptInvitationForm = () => {
    return (
      <Form onSubmit={handleAcceptInvitation}>
        <Button variant="success" size="sm" type="submit">
          Accept Invitation
        </Button>
      </Form>
    );
  };

  const renderPendingApprovalButton = () => {
    return (
      <Button variant="secondary" size="sm" disabled>
        Pending Approval from Study Owner
      </Button>
    );
  };

  const renderJoinStudyOption = () => {
    if (!idToken) {
      return null;
    }

    if (isStudyFull()) {
      return <p>(This study is full)</p>;
    } else {
      return (
        <div>
          <Button variant="outline-primary" size="sm" onClick={() => setJoinModalShow(true)}>
            Request to Join Study
          </Button>

          <Modal show={joinModalShow} onHide={() => setJoinModalShow(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>
                Request to Join <i>{study.title}</i> Study
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
      );
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
            {isUserParticipant() || userId === "developer" ? (
              <Link to={`/studies/${study.study_id}`} className="text-decoration-none card-link">
                {study.title}
              </Link>
            ) : (
              study.title
            )}
          </h4>

          {study.study_information && renderInfoButton()}

          <StudyConfigBadge studyType={study.study_type} />
          <Card.Text className="my-2">{study.description}</Card.Text>

          {isUserParticipant()
            ? null
            : isUserInvited()
            ? renderAcceptInvitationForm()
            : isUserRequested()
            ? renderPendingApprovalButton()
            : renderJoinStudyOption()}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DisplayStudy;
