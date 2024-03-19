import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { Study } from "../../types/study";
import SharedStudyParameters from "./SharedStudyParameters";
import useGenerateAuthHeaders from "../../hooks/useGenerateAuthHeaders";
import { submitStudyParameters } from "../../utils/formUtils";

interface StudyParametersProps {
  study: Study;
  userId: string;
}

const StudyParametersModal: React.FC<StudyParametersProps> = ({ study, userId }) => {
  const { apiBaseUrl } = useContext(AppContext);
  const headers = useGenerateAuthHeaders();
  const location = useLocation();
  const navigate = useNavigate();
  const isNewStudy = location.state?.isNewStudy;
  const [show, setShow] = useState(isNewStudy);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (isNewStudy) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [isNewStudy, navigate, location.pathname]);

  const owner = userId === study.owner;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
    submitStudyParameters(e, apiBaseUrl, study.study_id, headers, undefined, setErrorMessage);
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
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
