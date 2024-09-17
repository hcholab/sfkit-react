import React from "react";
import { Button, Modal } from "react-bootstrap";
import { DryRunFunc } from "../../pages/studies/Study";
import { ParameterGroup } from "../../types/study";
import InstructionSteps from "./InstructionSteps";

interface ConfigureStudyModalProps {
  handleShow: () => void;
  handleClose: () => void;
  handleStartWorkflow: DryRunFunc;
  showModal: boolean;
  demo: boolean;
  studyId: string;
  studyType: string;
  personalParameters: ParameterGroup;
  failStatus: string;
}

const ConfigureComputeEnvModal: React.FC<ConfigureStudyModalProps> = ({
  handleShow,
  handleClose,
  handleStartWorkflow,
  showModal,
  demo,
  studyId,
  studyType,
  personalParameters,
  failStatus,
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
          <InstructionSteps
            demo={demo}
            studyId={studyId}
            studyType={studyType}
            parameters={personalParameters}
            handleStartWorkflow={handleStartWorkflow}
            failStatus={failStatus}
          />
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
