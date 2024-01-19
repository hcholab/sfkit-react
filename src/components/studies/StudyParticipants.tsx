import React, { useContext } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../App";
import { Study } from "../../types/study";

interface StudyProps {
  study: Study;
  userId: string;
  idToken: string;
}

const StudyParticipants: React.FC<StudyProps> = ({ study, userId, idToken }) => {
  const { apiBaseUrl } = useContext(AppContext);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleShowInviteModal = () => setShowInviteModal(true);
  const handleCloseInviteModal = () => setShowInviteModal(false);

  const handleInviteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiBaseUrl}/api/invite_participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ study_id: study.study_id, inviter_id: userId, invitee_email: email, message }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || "Unexpected error");
      }

      window.location.reload();
    } catch (error) {
      console.error("Failed to invite participant:", error);
    }
  };

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/remove_participant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ study_id: study.study_id, userId: participantId }),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || "Unexpected error");
      }

      window.location.reload();
    } catch (error) {
      console.error("Failed to remove participant:", error);
    }
  };

  const handleApproveRequest = async (participantId: string) => {
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/approve_join_study?study_id=${study.study_id}&userId=${participantId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error((await response.json()).error || "Unexpected error");
      }

      window.location.reload();
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  return (
    <div className="my-5">
      <div className="mb-1">
        <div className="col-lg-7 mx-auto">
          <ListGroup>
            <ListGroup.Item className="bg-light">
              <h5 className="mb-0">Study Participants</h5>
            </ListGroup.Item>
            {study.participants.map(
              (participant: string, index: number) =>
                index !== 0 && (
                  <ListGroup.Item className="text-start" key={participant}>
                    <div className="d-flex justify-content-between">
                      <Link className="text-decoration-none" to={`/profile/${encodeURIComponent(participant)}`}>
                        {study["display_names"][participant] || participant}
                      </Link>

                      {participant === study.owner && (
                        <span className="badge rounded-pill bg-secondary" style={{ lineHeight: "normal" }}>
                          Creator
                        </span>
                      )}
                      {userId === study.owner && userId !== participant && (
                        <span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveParticipant(participant)}
                          >
                            Remove
                          </Button>
                        </span>
                      )}
                    </div>
                  </ListGroup.Item>
                )
            )}
            {study.demo && (
              <ListGroup.Item className="text-start">
                Example Collaborator <span className="text-muted">(for demo)</span>
              </ListGroup.Item>
            )}
            {study.requested_participants && Object.keys(study.requested_participants).length > 0 && (
              <>
                <ListGroup.Item className="bg-light">
                  <h6 className="mb-0 fw-normal">Requested Participants</h6>
                </ListGroup.Item>
                {Object.keys(study.requested_participants).map((participant: string) => (
                  <ListGroup.Item key={participant}>
                    <div className="d-flex justify-content-between">
                      <span>
                        <Link className="text-decoration-none" to={`/profile/${encodeURIComponent(participant)}`}>
                          {study["display_names"][participant] || participant}
                        </Link>
                      </span>
                      <span>
                        <Button variant="outline-success" size="sm" onClick={() => handleApproveRequest(participant)}>
                          Approve Request
                        </Button>
                      </span>
                    </div>
                    {study.requested_participants[participant] && (
                      <div className="text-start">
                        <span className="text-muted">Message:</span>
                        <span>{study.requested_participants[participant]}</span>
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
              </>
            )}
            {study.invited_participants && study.invited_participants.length > 0 && (
              <>
                <ListGroup.Item className="bg-light">
                  <h6 className="mb-0 fw-normal">Invited Participants</h6>
                </ListGroup.Item>
                {study.invited_participants.map((participant: string) => (
                  <ListGroup.Item className="text-start" key={participant}>
                    {participant}
                  </ListGroup.Item>
                ))}
              </>
            )}
          </ListGroup>
        </div>
      </div>

      <div>
        <Button variant="outline-primary" size="sm" onClick={handleShowInviteModal}>
          Invite New Study Participant
        </Button>

        <Modal show={showInviteModal} onHide={handleCloseInviteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Invite New Study Participant</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleInviteSubmit}>
            <Modal.Body>
              <div className="text-start text-muted">
                <p>An invitation to join this study will be sent to this email.</p>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>(optional) Message</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Leave a message here"
                  style={{ height: "100px" }}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseInviteModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default StudyParticipants;
