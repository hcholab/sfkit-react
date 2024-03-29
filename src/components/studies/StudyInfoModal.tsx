import React, { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AppContext } from "../../App";
import { Study } from "../../types/study";
import useGenerateAuthHeaders from "../../hooks/useGenerateAuthHeaders";

interface StudyInfoProps {
  study: Study;
  userId: string;
}

const StudyInfoModal: React.FC<StudyInfoProps> = ({ study, userId }) => {
  const { apiBaseUrl } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState(study.description || "");
  const [information, setInformation] = useState(study.study_information || "");
  const [errorMessage, setErrorMessage] = useState("");
  const headers = useGenerateAuthHeaders();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiBaseUrl}/api/study_information?study_id=${study.study_id}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ description, information }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unexpected error");
      }
      window.location.reload();
    } catch (error) {
      console.error("Failed to save changes:", error);
      setErrorMessage((error as Error).message || "Failed to save changes");
    }
  };

  return (
    <>
      <Button variant="outline-secondary" size="sm" className="me-1" onClick={handleShow}>
        Study Information
      </Button>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Study Information: {study.title}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveChanges}>
          <Modal.Body>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <Form.Group className="mb-3">
              <Form.Label>Study Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="One-line description of your study"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={userId !== study.owner}
              />
              <Form.Text className="text-muted">One-line Description of Your Study.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Study Information</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Any additional details you want to include. This can contain things like Motivation, Goals, and Data Sources."
                value={information}
                onChange={(e) => setInformation(e.target.value)}
                disabled={userId !== study.owner}
              />
              <Form.Text className="text-muted">
                Study Information: Any additional details you want to include. This can contain things like Motivation,
                Goals, and Data Sources.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {userId === study.owner && (
              <Button variant="primary" type="submit">
                Save changes
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default StudyInfoModal;
