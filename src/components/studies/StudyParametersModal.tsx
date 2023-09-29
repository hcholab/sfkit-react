import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Study } from "../../types/study";
import SharedStudyParameters from "./SharedStudyParameters";

interface StudyParametersProps {
  study: Study;
  userId: string;
  idToken: string;
}

const StudyParametersModal: React.FC<StudyParametersProps> = ({ study, userId, idToken }) => {
  const [show, setShow] = useState(false);

  const owner = userId === study.owner;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/parameters?study_id=${study.study_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(Object.fromEntries(formData)),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      window.location.reload();
    } catch (error) {
      console.error("Failed to save study parameters:", error);
    }
  };

  return (
    <>
      <Button variant="outline-secondary" size="sm" onClick={handleShow}>
        Study Parameters
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Study Parameters: {study.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveChanges}>
          <Modal.Body>
            <SharedStudyParameters study={study} isOwner={owner} userId={userId} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default StudyParametersModal;
