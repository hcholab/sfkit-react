import React from "react";
import { Button } from "react-bootstrap";

interface StudyActionButtonsProps {
  isRestarting: boolean;
  handleRestartStudy: () => Promise<void>;
  isDeleting: boolean;
  handleDeleteStudy: () => Promise<void>;
}

const StudyActionButtons: React.FC<StudyActionButtonsProps> = ({
  isRestarting,
  handleRestartStudy,
  isDeleting,
  handleDeleteStudy,
}) => {
  return (
    <div className="d-inline-flex">
      <Button variant="dark" size="sm" className="me-2" onClick={handleRestartStudy} disabled={isRestarting}>
        {isRestarting ? (
          <>
            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Restarting...
          </>
        ) : (
          "Restart Study"
        )}
      </Button>

      <Button variant="danger" size="sm" onClick={handleDeleteStudy} disabled={isDeleting}>
        {isDeleting ? (
          <>
            <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Deleting...
          </>
        ) : (
          "Delete Study"
        )}
      </Button>
    </div>
  );
};

export default StudyActionButtons;
