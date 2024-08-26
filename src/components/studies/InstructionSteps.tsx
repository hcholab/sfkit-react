import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Dropdown, Form } from "react-bootstrap";
import useGenerateAuthHeaders from "../../hooks/useGenerateAuthHeaders";
import { useTerra } from "../../hooks/useTerra";
import info_square from "../../static/images/info-square.svg";
import { ParameterGroup } from "../../types/study";
import { submitStudyParameters } from "../../utils/formUtils";
import GivePermissions from "./GivePermissions";

interface InstructionStepsProps {
  demo: boolean;
  study_id: string;
  parameters: ParameterGroup;
}

type Workspace = {
  bucketName: string;
  name: string;
  namespace: string;
  cloudPlatform: string;
  accessLevel: string;
};

const InstructionSteps: React.FC<InstructionStepsProps> = ({ demo, study_id, parameters }) => {
  const { onTerra, apiBaseUrl } = useTerra();
  const [activeKey, setActiveKey] = useState(localStorage.getItem("activeKey") || "0");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>();
  const [workspaceSearchTerm, setWorkspaceSearchTerm] = useState("");
  const headers = useGenerateAuthHeaders();
  const rawlsApiURL = `https://${apiBaseUrl.hostname.replace(/^sfkit\./, "rawls.")}/api`;

  useEffect(() => {
    localStorage.setItem("activeKey", activeKey);
  }, [activeKey]);

  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  useEffect(() => {
    setSubmitFeedback(null);
  }, [activeKey]);

  useEffect(() => {
    if (!onTerra || !headers.Authorization) return;

    const listWorkspaces = async () => {
      try {
        const url = `${rawlsApiURL}/workspaces?fields=workspace.namespace,workspace.name,workspace.bucketName`;
        const res = await fetch(url, { headers });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "");
        }
        setWorkspaces(data
          .map(({ workspace, accessLevel }: { workspace: Workspace, accessLevel: string }) => ({
            ...workspace,
            accessLevel
          }))
          .filter((ws: Workspace) => ws.cloudPlatform === "Gcp" && ws.accessLevel !== "READER")
        );
      } catch (err) {
        console.error("Error fetching workspaces:", err);
      }
    };

    listWorkspaces();
  }, [onTerra, rawlsApiURL, headers]);

  const handleSubmitParameters = (event: React.FormEvent<HTMLFormElement>) => {
    submitStudyParameters(event, apiBaseUrl, study_id, headers, setSubmitFeedback);
  };

  const filteredOptions = workspaces.filter(ws =>
    ws.name.toLowerCase().startsWith(workspaceSearchTerm.toLowerCase()) ||
    ws.namespace.toLowerCase().startsWith(workspaceSearchTerm.toLowerCase())
  );

  return (
    <Accordion activeKey={activeKey}>
      <Card>
        <Card.Header>1. {onTerra ? "Select Terra Workspace" : "Prepare Project"}</Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            { onTerra ? (
            <div>
              <p>
                1. Please select a Terra workspace to host the input dataset and run privacy-preserving computation on it.
              </p>
              <div className="mb-2">
                <Dropdown onSelect={key => key && setSelectedWorkspace(key)}>
                  <Dropdown.Toggle className="form-select">
                    {selectedWorkspace || 'Select Workspace'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Form.Control
                      autoFocus
                      className="mx-3 my-2 w-auto"
                      placeholder="Type to filter..."
                      onChange={(e) => setWorkspaceSearchTerm(e.target.value)}
                      value={workspaceSearchTerm}
                    />
                    {filteredOptions.map((option, index) => (
                      <Dropdown.Item key={index} eventKey={`${option.namespace}/${option.name}`}>
                        {option.namespace}/{option.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                </div>
            </div>
            ) : (
            <div>
              <p>
                1. You should create a GCP (Google Cloud Platform) project that is dedicated to this study. If you are
                new to GCP, go to{" "}
                <a
                  href="https://cloud.google.com/"
                  className="text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
            )}
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
              <form onSubmit={handleSubmitParameters}>
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
              <form onSubmit={handleSubmitParameters}>
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
            <form onSubmit={handleSubmitParameters}>
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
