import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { AppContext } from "../../App";
import useGenerateAuthHeaders from "../../hooks/useGenerateAuthHeaders";
import { ParameterGroup } from "../../types/study";
import ConfigureStudyModal from "./ConfigureStudyModal";
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
  showFailStatus: boolean;
  handleStartWorkflow: () => void;
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
  showFailStatus,
  handleStartWorkflow,
  handleDownloadAuthKey,
}) => {
  const { apiBaseUrl } = useContext(AppContext);
  const { auth_key = "" } = useParams();
  const [showModal, setShowModal] = React.useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [plotSrc, setPlotSrc] = React.useState("");
  const [isFetchingPlot, setIsFetchingPlot] = React.useState(false);
  const plotSrcRef = React.useRef("");
  const headers = useGenerateAuthHeaders();

  const fetchPlotFile = React.useCallback(async () => {
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

  React.useEffect(() => {
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
            <React.Fragment key={index}>
              <TaskElement task={task} showCheck={showCheck} />
              <SubTaskContainer taskDescription={task}>{subTasks}</SubTaskContainer>
            </React.Fragment>
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

  return (
    <div className="mt-3" id="instructions">
      {status === "" ? (
        <>
          <ConfigureStudyModal
            showModal={showModal}
            handleShow={handleShow}
            handleClose={handleClose}
            studyType={studyType}
            demo={demo}
            studyId={study_id}
            personalParameters={personalParameters}
          />
          <div className="mt-2">
            <Button variant="success" onClick={handleStartWorkflow}>
              Begin {studyType} Workflow
            </Button>
          </div>
        </>
      ) : null}
      <hr/>OR<hr/>
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
          <div>
            Click below to download <code>auth_key.txt</code> which you will need on your machine to authenticate with
            the sfkit command-line interface.
            <div className="text-center mt-2">
              <button className="btn btn-primary btn-sm" onClick={handleDownloadAuthKey}>
                Download Auth Key
              </button>
            </div>
          </div>
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
          {showFailStatus && <div className="text-start alert alert-danger">Study execution has failed.</div>}{" "}
        </div>
      ) : null}
    </div>
  );
};

export default InstructionArea;
