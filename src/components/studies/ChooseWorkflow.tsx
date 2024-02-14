import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const ChooseWorkflow: React.FC = () => {
  const navigate = useNavigate();
  const [studyType, setStudyType] = useState("MPC-GWAS");
  const [setupConfig, setSetupConfig] = useState("website");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = () => {
    navigate("/studies/create_study", {
      state: {
        studyType: studyType,
        setupConfig: setupConfig,
      },
    });

    handleClose();
  };

  const workflowOptions = [
    { id: "mpcgwas", value: "MPC-GWAS", label: "MPC-GWAS" },
    { id: "sfgwas", value: "SF-GWAS", label: "SF-GWAS" },
    { id: "pca", value: "PCA", label: "SF-PCA" },
    { id: "sfrelate", value: "SF-RELATE", label: "SF-RELATE" },
  ];

  return (
    <div>
      <div className="row justify-content-center mb-5 mt-2">
        <Button className="col-md-auto btn btn-primary" onClick={handleShow}>
          Create New Study
        </Button>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose Workflow and Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Which workflow would you like to run?</p>

            {workflowOptions.map((option) => (
              <div className="form-check" key={option.id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="CHOOSE_STUDY_TYPE"
                  id={option.id}
                  value={option.value}
                  checked={studyType === option.value}
                  onChange={() => setStudyType(option.value)}
                />
                <label className="form-check-label" htmlFor={option.id}>
                  {option.label}
                </label>
              </div>
            ))}

            <div className="mt-2">
              <small className="text-muted">
                Note: If you are unsure which workflow to choose, you can read more about them on the{" "}
                <Link className="text-decoration-none" to="/workflows">
                  Workflows
                </Link>{" "}
                page.
              </small>
            </div>
          </div>
          <hr />
          <div>
            <p>How do you want to have your GCP project configured?</p>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="SETUP_CONFIGURATION"
                id="website"
                value="website"
                checked={setupConfig === "website"}
                onChange={() => setSetupConfig("website")}
              />
              <label className="form-check-label" htmlFor="website">
                <span className="badge bg-auto-cfg">auto-configured</span>
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="SETUP_CONFIGURATION"
                id="user"
                value="user"
                checked={setupConfig === "user"}
                onChange={() => setSetupConfig("user")}
              />
              <label className="form-check-label" htmlFor="user">
                <span className="badge bg-user-cfg">user-configured</span>
              </label>
            </div>

            <div className="mt-2">
              <small className="text-muted">
                Note: If you are unsure which configuration to choose, you can read more about them on the{" "}
                <Link className="text-decoration-none" to="/instructions">
                  Instructions
                </Link>{" "}
                page.
              </small>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChooseWorkflow;
