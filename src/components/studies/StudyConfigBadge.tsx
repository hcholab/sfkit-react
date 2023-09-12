import React, { useState } from "react";
import { Badge, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface StudyConfigBadgeProps {
  setupConfiguration: string;
  studyType: string;
}

const StudyConfigBadge: React.FC<StudyConfigBadgeProps> = ({ setupConfiguration, studyType }) => {
  const [showModal, setShowModal] = useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  return (
    <div>
      {setupConfiguration === "website" ? (
        <>
          <Badge className="badge bg-auto-cfg" onClick={handleModalShow}>
            auto-configured <i className="bi bi-question-circle"></i>
          </Badge>
          <Modal show={showModal && setupConfiguration === "website"} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <Badge className="badge bg-auto-cfg">auto-configured</Badge> Study
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You have chosen to configure this study via the website. This means that the website will do most of the
              heavy-lifting to run the protocol for you. See{" "}
              <Link to="/instructions" className="text-decoration-none">
                Instructions
              </Link>{" "}
              for more information.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <>
          <Badge className="badge bg-user-cfg" onClick={handleModalShow}>
            user-configured <i className="bi bi-question-circle"></i>
          </Badge>
          <Modal show={showModal && setupConfiguration === "user"} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <Badge className="badge bg-user-cfg">user-configured</Badge> Study
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              You have chosen to configure this study via the sfkit command-line interface. This means that you will run
              the protocol yourself via the sfkit CLI. See{" "}
              <Link to="/instructions" className="text-decoration-none">
                Instructions
              </Link>{" "}
              for more information.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}{" "}
      <Badge className="bg-secondary margin-top">{studyType} study</Badge>
    </div>
  );
};

export default StudyConfigBadge;
