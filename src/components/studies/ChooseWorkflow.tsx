import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useMsal } from "@azure/msal-react";
import { Link, useNavigate } from "react-router-dom";

const ChooseWorkflow: React.FC = () => {
  const { accounts } = useMsal();
  const navigate = useNavigate();
  const [studyType, setStudyType] = useState("MPC-GWAS");
  const [setupConfig, setSetupConfig] = useState("website");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = () => {
    if (accounts.length > 0) {
      navigate("/studies/create_study", {
        state: {
          studyType: studyType,
          setupConfig: setupConfig,
        },
      });
    } else {
      alert("You need to log in first!");
    }
    handleClose();
  };

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

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="CHOOSE_STUDY_TYPE"
                id="mpcgwas"
                value="MPC-GWAS"
                checked={studyType === "MPC-GWAS"}
                onChange={() => setStudyType("MPC-GWAS")}
              />
              <label className="form-check-label" htmlFor="mpcgwas">
                MPC-GWAS
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="CHOOSE_STUDY_TYPE"
                id="sfgwas"
                value="SF-GWAS"
                checked={studyType === "SF-GWAS"}
                onChange={() => setStudyType("SF-GWAS")}
              />
              <label className="form-check-label" htmlFor="sfgwas">
                SF-GWAS
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="CHOOSE_STUDY_TYPE"
                id="pca"
                value="PCA"
                checked={studyType === "PCA"}
                onChange={() => setStudyType("PCA")}
              />
              <label className="form-check-label" htmlFor="pca">
                SF-PCA
              </label>
            </div>

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
