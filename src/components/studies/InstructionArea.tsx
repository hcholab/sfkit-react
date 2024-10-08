import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useCheckNatType } from "../../hooks/useCheckNatType";
import useGenerateAuthHeaders from "../../hooks/useGenerateAuthHeaders";
import { useTerra } from "../../hooks/useTerra";
import { DryRunFunc } from "../../pages/studies/Study";
import { ParameterGroup } from "../../types/study";
import ConfigureComputeEnvModal from "./ConfigureStudyModal";
import SubTaskContainer from "./SubTaskContainer";
import TaskElement from "./TaskElement";

interface Props {
  personalParameters: ParameterGroup;
  title: string;
  study_id: string;
  idToken: string;
  demo: boolean;
  studyType: string;
  status: string;
  showWaitingDiv: boolean;
  tasks: string[];
  parameters: ParameterGroup;
  showDownloadDiv: boolean;
  showManhattanDiv: boolean;
  imageSrc: string;
  imageLabel: string;
  failStatus: string;
  handleStartWorkflow: DryRunFunc;
  handleDownloadAuthKey: () => void;
}

const InstructionArea: React.FC<Props> = ({
  personalParameters,
  title,
  study_id,
  idToken,
  demo,
  studyType,
  status,
  showWaitingDiv,
  tasks,
  showDownloadDiv,
  showManhattanDiv,
  failStatus,
  handleStartWorkflow,
  handleDownloadAuthKey,
}) => {
  const { apiBaseUrl, onTerra } = useTerra();
  const { auth_key = "" } = useParams();
  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [plotSrc, setPlotSrc] = useState("");
  const [isFetchingPlot, setIsFetchingPlot] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isStudyValid, setIsStudyValid] = useState<boolean>();
  const { checkNatType, isSymmetricNat, isCheckingNatType } = useCheckNatType();
  const headers = useGenerateAuthHeaders();
  const plotSrcRef = useRef("");

  const fetchPlotFile = useCallback(async () => {
    try {
      setIsFetchingPlot(true);

      const response = await fetch(`${apiBaseUrl}/api/fetch_plot_file`, {
        method: "POST",
        headers,
        body: JSON.stringify({ study_id: study_id }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).error || "Unexpected error");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPlotSrc(url);
      plotSrcRef.current = url;
    } catch (error) {
      console.error("Failed to fetch plot file:", error);
    } finally {
      setIsFetchingPlot(false);
    }
  }, [apiBaseUrl, study_id, headers]);

  useEffect(() => {
    if ((idToken || auth_key) && showManhattanDiv && !plotSrcRef.current) {
      fetchPlotFile();
    }
  }, [showManhattanDiv, fetchPlotFile, idToken, auth_key]);

  const handleDownloadResults = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`${apiBaseUrl}/api/download_results_file?study_id=${encodeURIComponent(study_id)}`, {
        method: "GET",
        headers,
      });
      if (!response.ok) {
        throw new Error((await response.json()).error || "Unexpected error");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${title}_results.zip`;

      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download results:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderTasks = () => {
    if (!Array.isArray(tasks)) {
      console.error("Tasks is not an array", tasks);
      return null;
    }

    const finishedProtocol = status.includes("Finished protocol");
    let subTaskElements: React.ReactNode[] = [];
    let isSubTask = false;

    const taskElements = tasks.map((task, index) => {
      const showCheck = finishedProtocol || index < tasks.length - 1;
      if (task.startsWith("sub-task: ")) {
        const taskDescription = task.replace("sub-task: ", "");
        if (!isSubTask) {
          isSubTask = true;
        }
        subTaskElements.push(<TaskElement key={index} task={taskDescription} showCheck={showCheck} isSubTask={true} />);
      } else {
        isSubTask = false;
        if (subTaskElements.length > 0) {
          const subTasks = subTaskElements;
          subTaskElements = [];
          return (
            <Fragment key={index}>
              <TaskElement task={task} showCheck={showCheck} />
              <SubTaskContainer taskDescription={task}>{subTasks}</SubTaskContainer>
            </Fragment>
          );
        } else {
          return <TaskElement key={index} task={task} showCheck={showCheck} />;
        }
      }
    });

    return (
      <>
        {taskElements}
        {isSubTask && subTaskElements.length > 0 && (
          <SubTaskContainer taskDescription={tasks[tasks.length - 2]}>{subTaskElements}</SubTaskContainer>
        )}
      </>
    );
  };

  const renderCode = (text: string, fontSize: string = "100%") => (
    <p className="p-2 rounded position-relative" style={{ backgroundColor: "#f0f0f0", fontSize }}>
      <code>
        {text.split('\n').map((line, i, arr) => (
          <React.Fragment key={i}>
            {i && arr[i - 1].endsWith('\\') ? <>&nbsp;&nbsp;&nbsp;&nbsp;</> : ""}
            {line.trim()}
            {i < arr.length - 1 ? <br /> : ""}
          </React.Fragment>
        ))}
      </code>
      <button
        className="btn btn-sm btn-light position-absolute top-0 end-0 m-1"
        onClick={() => navigator.clipboard.writeText(
          text.split('\n').map((line, i, arr) =>
            line.replace(/^\s+/g, i && arr[i - 1].endsWith('\\') ? '    ' : '')
          ).join('\n')
        )}
        onMouseEnter={() => setHoveredButton(text)}
        onMouseLeave={() => setHoveredButton(null)}
        style={{
          opacity: hoveredButton === text ? 1 : 0.1,
          transition: 'opacity 0.3s ease',
          fontSize: "100%",
        }}
      >
        ⧉
      </button>
    </p>
  );

  return (
    <div className="mt-3" id="instructions">
      {status === "" ? (
        <>
          <ConfigureComputeEnvModal
            showModal={showModal}
            handleShow={handleShow}
            handleClose={handleClose}
            handleStartWorkflow={handleStartWorkflow}
            demo={demo}
            studyId={study_id}
            studyType={studyType}
            personalParameters={personalParameters}
            failStatus={failStatus}
          />
          <hr/>OR<hr/>
        </>
      ) : null}
      {status === "" ? (
        <div className="text-start">
          <p>
            Once all participants have joined the study, and you have set the 'Study Parameters', you can proceed with
            the
            <a className="text-decoration-none" href="https://sfkit.readthedocs.io/en/latest/tutorial.html#cli">
              {" "}
              sfkit Command-Line Interface (CLI){" "}
            </a>
            on your machine.
          </p>
          <div className="my-2" style={{ borderTop: 'dashed #ccc' }}/>
          <p>
            { onTerra ? (
              <>
                If you are running the study on a machine <b><i>outside of Terra</i></b>, you
              </>
            ) : (
              <>
                On your machine, you
              </>
            )} will need to download <code>
            { onTerra ? "service_account_key.json" : "auth_key.txt" }
            </code> { onTerra && "and run the following command " }
            to authenticate the <i>sfkit</i> command-line interface:
          </p>
          { onTerra && (
            <>
              {renderCode("export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service_account_key.json")}
              <p>
                <b>Note:</b> Replace <code>/path/to/service_account_key.json</code> with
                the <b><i>absolute path</i></b> to the service account key downloaded to your machine.
              </p>
              <div className="alert alert-warning mt-2">
                <b>Warning:</b> This key contains sensitive credentials.
                Store it in a secure out-of-the-way location on your computer, such as
                the <code>~/.config/gcloud/</code> directory.
                Never share this key or commit it to version control.
              </div>
            </>
          )}
          <p className="text-center mt-2">
            <button className="btn btn-primary btn-sm" onClick={handleDownloadAuthKey}>
              Download { onTerra ? "Service Account Key" : "Auth Key" }
            </button>
          </p>

          <div>
            <p>
              You will also need to check the type of Network Address Translation (NAT) on your machine.
              This is done automatically by the <i>sfkit</i> CLI. However, if you use it on the same machine,
              you can also click the following button:
            </p>
            <p className="text-center mt-3">
              <button
                className="btn btn-primary btn-sm"
                onClick={checkNatType}
                disabled={isCheckingNatType === true}
              >
                {isCheckingNatType ? 'Checking NAT Type...' : 'Check NAT Type'}
              </button>

            </p>
            {isCheckingNatType === false && (
              <div className={ "alert mt-2 alert-" + (
                isSymmetricNat === true ? "danger" : (
                  isSymmetricNat === false ? "success" : "warning"
                )
              )}>
                { isSymmetricNat === true ? (
                  <>
                    <p>
                      <b>Error:</b> Your NAT is <i>symmetric</i>.
                      This means the CLI won't be able to establish peer-to-peer connections
                      with other participant machines. You will need to either set up port forwarding,
                      use a different network, or configure your network to use a different NAT type.
                    </p>
                    <p>
                      For more information on why that is, please refer to this article explaining
                      the nitty-gritty details: <a
                        href="https://tailscale.com/blog/how-nat-traversal-works"
                        className="text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                      >How NAT Traversal Works</a>
                    </p>
                  </>
                ) : (isSymmetricNat === false ? (
                  <div className="text-center">
                    ✔ Your NAT is compatible with the <i>sfkit</i> CLI.
                  </div>
                ) : (
                  <>
                    <b>Warning:</b> We were unable to determine your NAT type.
                    Please run <i>sfkit</i> CLI as explained below, which will check it automatically.
                  </>
                ))}
              </div>
            )}
          </div>

          <div className="my-2" style={{ borderTop: 'dashed #ccc' }}/>
          <p>
            To start <i>sfkit</i> protocol on your machine, first check that the study is set up correctly:
          </p>
          <p className="text-center">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setIsStudyValid(undefined);
                handleStartWorkflow({ dryRun: true })
                  .then(() => setIsStudyValid(true))
                  .catch(() => setIsStudyValid(false))
              }}
            >
              Validate Study
            </button>
          </p>
          { isStudyValid === true ? (
              <div className="alert alert-success text-center">
                ✔ Study is valid.
              </div>
            ) : (
              isStudyValid === false ? (
                <div className="alert alert-danger">
                  <b>Error:</b> {failStatus}
                </div>
              ) : (
                <></>
              )
            )
          }
          <p>
            Then, set some environment variables:
          </p>
          {renderCode(
            `export SFKIT_API_URL=${apiBaseUrl}/api
            export SFKIT_STUDY_ID=${study_id}
            export SFKIT_DATA_PATH=/path/to/data_dir`
          )}
          <p>
            <b>Note:</b> Replace <code>/path/to/data_dir</code> with
            the <b><i>absolute path</i></b> to the input data directory on your machine.
          </p>
          <p>
            Finally, either:
          </p>
          <ol>
            <li>
              <p>
                <b>(Recommended)</b> Use a container, if your environment can run arbitrary Docker images:
              </p>
              {renderCode(
                `docker run --rm -it --pull always --platform linux/amd64 \\
                  -v "\${SFKIT_DATA_PATH}":/data \\
                  -v "\${GOOGLE_APPLICATION_CREDENTIALS}":/key.json:ro \\
                  -e GOOGLE_APPLICATION_CREDENTIALS=/key.json \\
                  -e SFKIT_API_URL \\
                  us-central1-docker.pkg.dev/dsp-artifact-registry/sfkit/sfkit all \\
                  --data_path /data --study_id "\${SFKIT_STUDY_ID}"`
              )}
            </li>
            <li>
              <p>
                Install <i>sfkit</i> CLI manually using the following script:
              </p>
              {renderCode("curl -sL https://github.com/hcholab/sfkit/releases/latest/download/install.sh | bash", "87%")}
              <p>
                <b>Note:</b> This script might not work on some machines.
                If you are unable to install the CLI with this method, please contact us
                at <a href="mailto:support@sfkit.org">support@sfkit.org</a>.
              </p>
              <p>
                Then, run this command to start the protocol:
              </p>
              {renderCode(`sfkit all --data_path "\${SFKIT_DATA_PATH}" --study_id "\${SFKIT_STUDY_ID}"`)}
            </li>
          </ol>
        </div>
      ) : null}
      {status !== "" ? (
        <div>
          {showWaitingDiv && (
            <div className="text-start alert alert-primary">Waiting for other participants to be ready...</div>
          )}
          <div className="task text-start">{renderTasks()}</div>
          {String(personalParameters["SEND_RESULTS"]?.value) === "Yes" && (
            <>
              {studyType === "SF-RELATE" && showDownloadDiv ? (
                <div className="mt-2">
                  Study completed! Download your results below or ssh into your machine to view details.
                  <br></br>
                  <button onClick={handleDownloadResults} className="btn btn-link text-decoration-none">
                    Download results
                    {isDownloading && (
                      <span className="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  {showDownloadDiv && (
                    <button onClick={handleDownloadResults} className="btn btn-link text-decoration-none">
                      Download results
                      {isDownloading && (
                        <span className="ms-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      )}
                    </button>
                  )}
                  {showManhattanDiv && (
                    <div className="mt-2">
                      {isFetchingPlot ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <img src={plotSrc} alt="Plot" className="w-100 h-100" />
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
          {failStatus && <div className="text-start alert alert-danger">Study execution has failed: {failStatus}</div>}{" "}
        </div>
      ) : null}
    </div>
  );
};

export default InstructionArea;
