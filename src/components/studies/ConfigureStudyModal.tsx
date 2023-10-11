import React from "react";
import { Button, Modal } from "react-bootstrap";
import InstructionSteps from "./InstructionSteps";
import { ParameterGroup } from "../../types/study";

interface ConfigureStudyModalProps {
  handleShow: () => void;
  handleClose: () => void;
  showModal: boolean;
  studyType: string;
  demo: boolean;
  idToken: string;
  studyId: string;
  personalParameters: ParameterGroup;
}

const ConfigureStudyModal: React.FC<ConfigureStudyModalProps> = ({
  handleShow,
  handleClose,
  showModal,
  studyType,
  demo,
  idToken,
  studyId,
  personalParameters,
}) => {
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Configure Study
      </Button>

      <Modal size="xl" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Configure your {studyType} Study</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InstructionSteps demo={demo} idToken={idToken} study_id={studyId} parameters={personalParameters} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfigureStudyModal;
