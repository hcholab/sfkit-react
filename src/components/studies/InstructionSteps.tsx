import { Accordion, Card, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import React from "react";
import { ParameterGroup } from "../../types/study";
import GivePermissions from "./GivePermissions";
import info_square from "../../static/images/info-square.svg";

interface InstructionStepsProps {
  demo: boolean;
  title: string;
  idToken: string;
  parameters: ParameterGroup;
}

const InstructionSteps: React.FC<InstructionStepsProps> = ({ demo, title, idToken, parameters }) => {
  const [activeKey, setActiveKey] = useState(localStorage.getItem("activeKey") || "0");
  useEffect(() => {
    localStorage.setItem("activeKey", activeKey);
  }, [activeKey]);

  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  useEffect(() => {
    setSubmitFeedback(null);
  }, [activeKey]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitFeedback("Processing...");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/parameters?title=${title}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setSubmitFeedback("Success!");
    } catch (error) {
      console.error("Failed to save study parameters:", error);
      setSubmitFeedback("Failed!");
    }
  };

  return (
    <Accordion activeKey={activeKey}>
      <Card>
        <Card.Header>1. Prepare Project</Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <div>
              <p>
                1. You should create a GCP (Google Cloud Platform) project that is dedicated to this study. If you are
                new to GCP, go to{" "}
                <a href="https://cloud.google.com/" className="text-decoration-none" target="_blank">
                  https://cloud.google.com/
                </a>{" "}
                to set up a project.
              </p>
              <p className="px-2">
                1a. You need to have the <code>gcloud.iam.roles.create</code> permission in your GCP project. If you are
                the owner/creator of the project, this is automatically given. If you are within an organization such
                that you are not the owner, please talk to your administrator to get the appropriate role. This could be
                "owner", but there are also other roles (such as "Project IAM Admin") that have this permission.
              </p>
              <p className="px-2">
                1b. You need to enable the
                <a
                  className="text-decoration-none"
                  href="https://cloud.google.com/compute/docs/reference/rest/v1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Compute Engine API{" "}
                </a>
                in your GCP account. If you don't know how to enable an API, see the Google documentation
                <a
                  href="https://cloud.google.com/endpoints/docs/openapi/enable-api"
                  className="text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  here
                </a>
                .
              </p>
            </div>
            <div className="text-end">
              <Button variant="success" onClick={() => setActiveKey("1")}>
                Next
              </Button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card>
        <Card.Header>2. Upload Data</Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <div>
              <p>
                1. Upload a folder with your data (unzipped) to a Google cloud storage bucket in your GCP (Google Cloud
                Platform) project. If you are unfamiliar with Google Cloud Storage, see the Google documentation
                <a
                  href="https://cloud.google.com/storage/docs/quickstart-console"
                  className="text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  here{" "}
                </a>
                (the default configuration/settings for the bucket are fine).
              </p>
              <p>2. Please set the following user-specific parameters:</p>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3 p-3 bg-light">
                  {["GCP_PROJECT", "DATA_PATH"].map((key) => (
                    <React.Fragment key={key}>
                      <label htmlFor={key} className="col-sm-3 col-form-label text-start">
                        {parameters[key].name}
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name={key}
                          id={key}
                          defaultValue={parameters[key].value}
                        />
                      </div>
                      <p className="mt-3 text-start text-muted">{parameters[key].description}</p>
                    </React.Fragment>
                  ))}
                  <div className="text-center">{submitFeedback}</div>
                  <div className="d-flex flex-wrap justify-content-center">
                    <input type="submit" name="save" value="Save" className="btn btn-primary me-2 mb-2 mb-sm-0" />
                  </div>
                </div>
              </form>
            </div>
            <div className="text-end">
              <Button variant="success" onClick={() => setActiveKey("0")}>
                Previous
              </Button>{" "}
              <Button variant="success" onClick={() => setActiveKey("2")}>
                Next
              </Button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card>
        <Card.Header>3. Give Permissions</Card.Header>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            <GivePermissions demo={demo} />
            <div className="text-end">
              <Button variant="success" onClick={() => setActiveKey("1")}>
                Previous
              </Button>{" "}
              <Button variant="success" onClick={() => setActiveKey("3")}>
                Next
              </Button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card>
        <Card.Header>4. Choose VM Size</Card.Header>
        <Accordion.Collapse eventKey="3">
          <Card.Body>
            <div>
              <p>
                Choose the Virtual Machine (VM) size that you would like to use for your study. The VM size determines
                the amount of memory and CPU cores that will be available to your study. The VM size also determines the
                cost of your study. If you would like guidance on what size machine to use, see the
                <a className="text-decoration-none" href="#machine_recommendations">
                  Machine Recommendations
                </a>{" "}
                section in the instructions page.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <label htmlFor="NUM_CPUS" className="col-sm-3 col-form-label text-start">
                    {parameters.NUM_CPUS.name}
                  </label>
                  <div className="col-sm-9">
                    <select
                      className="form-select"
                      name="NUM_CPUS"
                      id="NUM_CPUS"
                      defaultValue={parameters.NUM_CPUS.value}
                    >
                      {["16", "32", "64", "128"].map((value) => (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-3 text-start text-muted">{parameters.NUM_CPUS.description}</p>
                </div>

                <div className="row mb-3">
                  <label htmlFor="BOOT_DISK_SIZE" className="col-sm-3 col-form-label text-start">
                    {parameters.BOOT_DISK_SIZE.name}
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="number"
                      className="form-control"
                      name="BOOT_DISK_SIZE"
                      id="BOOT_DISK_SIZE"
                      min="10"
                      max="10000"
                      defaultValue={parameters.BOOT_DISK_SIZE.value}
                    />
                  </div>
                  <p className="mt-3 text-start text-muted">{parameters.BOOT_DISK_SIZE.description}</p>
                </div>

                <div className="text-center">
                  <div>{submitFeedback}</div>
                  <button className="btn btn-primary" type="submit">
                    Confirm Virtual Machine Configuration
                  </button>
                </div>
              </form>
            </div>
            <div className="text-end">
              <Button variant="success" onClick={() => setActiveKey("2")}>
                Previous
              </Button>{" "}
              <Button variant="success" onClick={() => setActiveKey("4")}>
                Next
              </Button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card>
        <Card.Header>5. Post-Processing</Card.Header>
        <Accordion.Collapse eventKey="4">
          <Card.Body>
            {demo && (
              <div className="alert alert-info" role="alert">
                <p className="mb-0">
                  <img src={info_square} className="me-1 mb-1" width="20" height="20" alt="info-square" />
                  This step can be skipped if you are following Tutorial 1 and using the default GCP Project.
                </p>
              </div>
            )}
            <div>
              <p>Options for what happens on protocol completion:</p>
            </div>
            <form onSubmit={handleSubmit}>
              {["DELETE_VM", "SEND_RESULTS"].map((key) => (
                <div className="text-start row" key={key}>
                  <label htmlFor={key} className="col-sm-3 col-form-label text-start">
                    {parameters[key]?.name}
                  </label>
                  <div className="col-sm-9">
                    <select className="form-select" name={key} id={key} defaultValue={parameters[key]?.value}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <p className="mt-3 text-start text-muted">{parameters[key]?.description}</p>
                </div>
              ))}

              <div className="text-start row">
                <label htmlFor="RESULTS_PATH" className="col-sm-3 col-form-label text-start">
                  {parameters.RESULTS_PATH.name}
                </label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    name="RESULTS_PATH"
                    id="RESULTS_PATH"
                    defaultValue={parameters.RESULTS_PATH.value}
                  />
                </div>
                <p className="mt-3 text-start text-muted">{parameters.RESULTS_PATH.description}</p>
              </div>

              <div className="text-center">
                <div>{submitFeedback}</div>
                <button className="btn btn-primary" type="submit">
                  Confirm Post-Processing Configuration
                </button>
              </div>
            </form>
            <div className="text-end">
              <Button variant="success" onClick={() => setActiveKey("3")}>
                Previous
              </Button>{" "}
              <Button variant="success" onClick={() => window.location.reload()}>
                Done
              </Button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default InstructionSteps;
