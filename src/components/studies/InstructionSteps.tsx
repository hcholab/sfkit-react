import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Dropdown, Form, ProgressBar } from "react-bootstrap";
import useGenerateAuthHeaders from "../../hooks/useGenerateAuthHeaders";
import { useTerra } from "../../hooks/useTerra";
import info_square from "../../static/images/info-square.svg";
import { ParameterGroup } from "../../types/study";
import { submitStudyParameters } from "../../utils/formUtils";
import GivePermissions from "./GivePermissions";

declare module 'react' {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: boolean | string;
  }
}

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
  googleProject: string;
  accessLevel: string;
};

const InstructionSteps: React.FC<InstructionStepsProps> = ({ demo, study_id, parameters }) => {
  const { onTerra, dev, apiBaseUrl } = useTerra();
  const [activeKey, setActiveKey] = useState(localStorage.getItem("activeKey") || "0");
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>();
  const [workspaceSearchTerm, setWorkspaceSearchTerm] = useState("");
  const [workspaceSearchDropdownOpen, setWorkspaceSearchDropdownOpen] = useState(false);
  const [workspaceBucketUrl, setWorkspaceBucketUrl] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const headers = useGenerateAuthHeaders();
  const rawlsApiURL = dev
    ? "https://sfkit.dsde-dev.broadinstitute.org/api"
    : `https://${apiBaseUrl.hostname.replace(/^sfkit\./, "rawls.")}/api`;


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
        const url = `${rawlsApiURL}/workspaces?fields=accessLevel,workspace.namespace,workspace.name,workspace.cloudPlatform,workspace.bucketName`;
        const res = dev
          ? { ok: true, json: async () => (await import("./workspaces.json")).default }
          : await fetch(url, { headers });
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
  }, [onTerra, dev, rawlsApiURL, headers]);

  const handleSubmitParameters = (event: React.FormEvent<HTMLFormElement>) => {
    submitStudyParameters(event, apiBaseUrl, study_id, headers, setSubmitFeedback);
  };

  const filteredOptions = workspaces.filter(ws =>
    `${ws.namespace}/${ws.name}`.toLowerCase().includes(workspaceSearchTerm.toLowerCase())
  );

  const handleUploadData = async (files: FileList | null) => {
    const ws = workspaces.find(ws =>
      `${ws.namespace}/${ws.name}` == selectedWorkspace
    );
    if (!files || !ws) return;

    const samApiUrl = `${rawlsApiURL.replace(/rawls\./, "sam.")}/google/v1/user/petServiceAccount/${ws.googleProject}/token`;
    const samRes = await fetch(samApiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify([
        "https://www.googleapis.com/auth/devstorage.read_write",
      ]),
    });
    if (!samRes.ok) {
      console.error("Error fetching SAM token:", await samRes.text());
      return;
    }
    const gcsToken = (await samRes.text()).replace(/"/g, "");

    const dataPath = `_sfkit/${study_id}/data`;
    await Promise.all(Array.from(files).map(async f => {
      const filePath = f.webkitRelativePath.split('/').slice(1).join('/');
      const objPath = encodeURIComponent(`${dataPath}/${filePath}`);
      setUploadProgress(p => ({ ...p, [filePath]: 0 }));

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://storage.googleapis.com/upload/storage/v1/b/${ws.bucketName}/o?uploadType=media&name=${objPath}`);
      xhr.setRequestHeader("Authorization", `Bearer ${gcsToken}`);

      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          setUploadProgress(p => ({
            ...p,
            [filePath]: (e.loaded / e.total) * 100,
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setUploadProgress(({ [filePath]: _, ...p }) => p);
        } else {
          console.error(`Error uploading file ${filePath}: ${xhr.status} ${xhr.statusText}`);
        }
      };

      xhr.onerror = () => {
        console.error(`Network error uploading ${filePath}`);
      };

      xhr.send(f);
    }));

    setWorkspaceBucketUrl(`gs://${ws.bucketName}/${dataPath}`);
  };

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
                <Dropdown
                  onSelect={key => key && setSelectedWorkspace(key)}
                  onToggle={setWorkspaceSearchDropdownOpen}
                  show={workspaceSearchDropdownOpen}
                >
                  <Dropdown.Toggle as="div" className="form-select">
                    <Form.Control
                      type="text"
                      placeholder="Search or Select Workspace..."
                      value={workspaceSearchTerm}
                      onChange={e => {
                        setWorkspaceSearchTerm(e.target.value);
                        if (filteredOptions.length && !workspaceSearchDropdownOpen) {
                          setWorkspaceSearchDropdownOpen(true);
                        }
                      }}
                      autoFocus
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {filteredOptions.map((option, index) => (
                      <Dropdown.Item
                        key={index}
                        eventKey={`${option.namespace}/${option.name}`}
                        onClick={() => setWorkspaceSearchTerm(`${option.namespace}/${option.name}`)}
                      >
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
              <p className="px-2">
                1c. <GivePermissions demo={demo} />
              </p>
            </div>
            )}
            <div className="text-end">
              <Button variant="success" onClick={() => setActiveKey("1")} disabled={onTerra && !selectedWorkspace}>
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
            { onTerra ? (
              <div>
                <p>
                  Upload a folder with your data (unzipped) to the workspace bucket using the button below:
                </p>
                <p>
                  <label htmlFor="upload-data-input" className="btn btn-success">
                    Upload Data
                  </label>
                  <input
                    type="file"
                    onChange={e => handleUploadData(e.target.files)}
                    style={{ display: 'none' }}
                    id="upload-data-input"
                    autoFocus
                    webkitdirectory=""
                  />
                </p>
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName} className="mb-2">
                    <p className="mb-1">{fileName}</p>
                    <ProgressBar variant="success" now={progress} />
                  </div>
                ))}
                <p>
                  Alternatively, you can upload it manually or via Terra portal, and paste the bucket URL here:
                </p>
                <p>
                  <Form.Control
                    type="text"
                    placeholder="Paste bucket URL starting with gs://..."
                    value={workspaceBucketUrl}
                    onChange={e => {
                      const url = e.target.value;
                      console.log("url", url);
                      if (!url || /^gs:\/(\/[-\w]+)+\/?$/.test(url)) {
                        setWorkspaceBucketUrl(url.replace(/\/$/, ""))
                      }
                    }}
                    autoFocus
                  />
                </p>
              </div>
            ) : (
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
            )}
            <div className="text-end">
              <Button variant="success" onClick={() => setActiveKey("0")}>
                Previous
              </Button>{" "}
              <Button variant="success" onClick={() => setActiveKey("2")} disabled={onTerra && !workspaceBucketUrl}>
                Next
              </Button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card>
        <Card.Header>3. Choose VM Size</Card.Header>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            <div>
              <p>
                Choose the Virtual Machine (VM) size that you would like to use for your study. The VM size determines
                the amount of memory and CPU cores that will be available to your study. The VM size also determines the
                cost of your study. If you would like guidance on what size machine to use, see the{" "}
                <a className="text-decoration-none" href="/instructions#machine_recommendations">
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
        <Card.Header>4. Post-Processing</Card.Header>
        <Accordion.Collapse eventKey="3">
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
              { (onTerra ? ["SEND_RESULTS"] : ["DELETE_VM", "SEND_RESULTS"]).map((key) => (
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

              { !onTerra && (
                <>
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
                </>
              )}
            </form>
            <div className="text-end">
              <Button variant="success" onClick={() => setActiveKey("2")}>
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
