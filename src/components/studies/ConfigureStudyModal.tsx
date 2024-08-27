import React from "react";
import { Button, Modal } from "react-bootstrap";
import InstructionSteps from "./InstructionSteps";
import { ParameterGroup } from "../../types/study";

interface ConfigureStudyModalProps {
  handleShow: () => void;
  handleClose: () => void;
  showModal: boolean;
  demo: boolean;
  studyId: string;
  personalParameters: ParameterGroup;
}

const ConfigureComputeEnvModal: React.FC<ConfigureStudyModalProps> = ({
  handleShow,
  handleClose,
  showModal,
  demo,
  studyId,
  personalParameters,
}) => {
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Configure Compute Environment
      </Button>

      <Modal size="xl" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Configure Compute Environment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InstructionSteps demo={demo} study_id={studyId} parameters={personalParameters} />
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

export default ConfigureComputeEnvModal;
