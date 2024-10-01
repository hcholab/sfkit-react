import React from "react";
import { Link } from "react-router-dom";
import { useTerra } from "../../hooks/useTerra";
import choose_title from "../../static/images/tutorial/choose_title.png";
import choose_vm_size from "../../static/images/tutorial/choose_vm_size.png";
import choose_workflow from "../../static/images/tutorial/choose_workflow.png";
import mpc_parameters from "../../static/images/tutorial/mpc_parameters.png";
import post_processing from "../../static/images/tutorial/post_processing.png";
import post_processing_terra from "../../static/images/tutorial/post_processing_terra.png";
import prepare_compute_terra from "../../static/images/tutorial/prepare_compute_terra.png";
import prepare_project from "../../static/images/tutorial/prepare_project.png";
import result from "../../static/images/tutorial/result.png";
import studies_index from "../../static/images/tutorial/studies_index.png";
import study from "../../static/images/tutorial/study.png";
import upload_data from "../../static/images/tutorial/upload_data.png";
import upload_data_terra from "../../static/images/tutorial/upload_data_terra.png";

const PrimaryTutorial: React.FC = () => {
  const { onTerra } = useTerra();
  return (
    <div>
      <div>
        <b className="text-muted">
          Note: This tutorial shows how to let <i>sfkit</i> portal automatically create a computing environment
          and launch the protocol. The alternative steps to launch it manually on your own machine are described
          on the study page.
        </b>
      </div>
      <h4 className="my-4 fw-normal">Introduction</h4>
      <div className="row">
        <p>
          This stand-alone tutorial can be run alone and will walk you through process of creating and executing a study
          on this platform. We will showcase the MPC-GWAS workflow, but the same tutorial can be followed with any of
          the workflows.
        </p>
        <p>
          The purpose of a GWAS study is to identify genetic variants that are associated with a trait of interest. In
          this tutorial, we will use a simulated dataset of genotypes, phenotypes, and covariates to demonstrate the
          process of running a GWAS study with multiple participants.
        </p>
      </div>

      {/* TODO: update video to match new UI */}
      { false && (
        <>
          <h4 className="my-4 fw-normal">Video Walkthrough</h4>
          <div className="row">
            <p>
              If you would like to follow along with a video walkthrough, you can watch the video below. The video follows
              the steps on this page.
            </p>
            <div className="text-center">
              <iframe
                className="border border-secondary"
                width="560"
                height="315"
                src="https://www.youtube-nocookie.com/embed/phPpkdUn3Qw"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={true}
              ></iframe>
            </div>
          </div>
        </>
      )}

      <h4 className="my-4 fw-normal">Creating a study</h4>
      <div className="row">
        <p>
          The first step is to create a study. To do this, go to the{" "}
          <Link className="text-decoration-none" to="/studies">
            Studies
          </Link>{" "}
          page and click{" "}
          <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Create New Study
          </span>
          <span className="text-muted">
            {" "}
            (In a real study, you could also choose to join someone else's study instead.).
          </span>
        </p>
        <p className="text-muted">
          Tip: We recommend following the tutorial steps in a separate browser tab. This way, you can easily switch
          between reading the instructions and performing the actions needed to create and run the study.
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-75 border border-secondary" src={studies_index} alt="Image failed to load" />
        </div>
      </div>

      <div className="row">
        <p>You will now see a dialog that looks something like this:</p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-50 border border-secondary" src={choose_workflow} alt="Image failed to load" />
        </div>
      </div>

      <div className="row">
        <p>
          You are given the option to choose among any of the 4 workflows. More details
          about these choices are available in the{" "}
          <Link className="text-decoration-none" target="_blank" to="/workflows">
            workflows
          </Link>{" "}
          and{" "}
          <Link className="text-decoration-none" target="_blank" to="/instructions">
            instructions
          </Link>
          . pages. For this tutorial, you can leave the default and then click{" "}
          <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Confirm
          </span>{" "}
          to continue.
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-75 border border-secondary" src={choose_title} alt="Image failed to load" />
        </div>
      </div>

      <div className="row">
        <p>
          On the next page, you will be asked to provide a name for your study. Pick any unique study title, and you can
          leave the description and study information blank. Be sure to check the "Demo Study" option. Then proceed by
          clicking{" "}
          <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Confirm
          </span>{" "}
          again.
        </p>
        <p>
          You will now be taken to a page to set the "Shared Study Parameters". For the demo, you can leave all
          of the parameters as they are. In a real study, you would set the parameters according to your data and
          preferences. Click{" "}
          <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Save changes
          </span>{" "}
          to proceed.
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-75 border border-secondary" src={mpc_parameters} alt="Image failed to load" />
        </div>
      </div>

      <h4 className="my-4 fw-normal">Configuring your study</h4>
      <div className="row">
        <p>You should now see a page that looks something like this:</p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-75 border border-secondary" src={study} alt="Image failed to load" />
        </div>
      </div>

      <div>
        <p>
          This is your main study page. Here you can see the status of your study, and you can download the results when
          the study is complete. This is also where you can view or add study participants.
          When all participants initiate their computational protocol, the joint study will begin. For
          this demo, you are the only real participant.
        </p>
        <p>
          You are now given a choice:
          <ol>
            <li>
              to let <i>sfkit</i> portal automatically create a computing environment
              { onTerra ? (<>, <i>optionally</i> upload your data to Terra, </>) : " "} and launch the computational protocol,
              according to a few parameters you choose, OR
            </li>
            <li>
              to launch it manually on your own machine
              { onTerra ? ", either inside or outside of Terra" : ""},
              following the instructions for <i>sfkit</i> command-line interface (CLI).
            </li>
          </ol>
        </p>
        <p>
          Option 1 is easier, but gives you less flexibility. To go with it, please click the{" "}
          <button className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Configure Compute Environment
          </button>{" "}
          button.
        </p>
      </div>

      <div className="row">
        <p>
          You should now see a dialog that looks something like this:
        </p>
      </div>
      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-75 border border-secondary" src={onTerra ? prepare_compute_terra : prepare_project} alt="Image failed to load" />
        </div>
      </div>
      <div className="row">
        <p>
          { onTerra ? <>
            1. Please pick a Terra workspace to run the demo study in.
          </> : <>
            <p>
              1. When running a real study, you would need to follow the instructions to set up your GCP account. For the
              sake of this demo, these steps are optional, and the default configuration will run the demo on a GCP machine
              controlled by us. If you would like to run the demo on your own GCP account, you can follow the instructions.
            </p>
            <p>
              If you are using your own GCP project, please also run the given command in your GCP cloud shell. This command
              will give the website permissions to set up the protocol for your study in your GCP project. Otherwise, you
              don't need to do anything here.
            </p>
          </>} When you are done, you can click{" "}
          <span className="btn btn-success btn-sm" style={{ pointerEvents: "none" }}>
            Next
          </span>
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-75 border border-secondary" src={onTerra ? upload_data_terra : upload_data} alt="Image failed to load" />
        </div>
      </div>

      <div className="row">
        <p>
          { onTerra ? <>
            2. For the sake of the demo, you can ignore the data path. In a real study,
            you would need to upload your data to the Terra workspace, either:
            <ul>
              <li>
                using{" "}
                <button className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
                  Upload Data
                </button>{" "} button, in which case the bucket URL will be populated automatically, or
              </li>
              <li>
                the main <a
                  href="https://app.terra.bio"
                  className="text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terra portal
                </a>, or through Google Cloud SDK or API, and then paste the <code>gs://</code> folder URL here.
              </li>
            </ul>
          </> : <>
            2. For the GCP Project ID, either leave it as is to use our machines or enter whatever GCP project you chose
            in step 0. Either way, for the sake of the demo, you can ignore the data paths. In a real study, you would
            need to upload your data to a bucket in your GCP account and indicate the paths to said data here.

            Click{" "}
            <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
              Save
            </span>{" "}
            if you have made any changes.
          </>} Once you are done with this step, you can click{" "}
            <span className="btn btn-success btn-sm" style={{ pointerEvents: "none" }}>
              Next
            </span>
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-75 border border-secondary" src={choose_vm_size} alt="Image failed to load" />
        </div>
      </div>

      <div className="row">
        <p>3. For the sake of this demo, you can leave the VM size as it is.</p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-75 border border-secondary" src={onTerra ? post_processing_terra : post_processing} alt="Image failed to load" />
        </div>
      </div>

      <div className="row">
        <p>
          4. For the sake of this demo, you can leave these values as they are. You can click{" "}
          <span className="btn btn-success btn-sm" style={{ pointerEvents: "none" }}>
            Begin MPC-GWAS Study
          </span>{" "}
          to proceed.
        </p>
      </div>

      <h4 className="my-4 fw-normal">Running your study</h4>
      <div>
        <p>
          The study should take about 1/2 hour to complete, and status updates will be
          visible on this page. Feel free to leave this page and come back. When the study is complete, a link to
          download the results should appear.
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img className="img-fluid w-50 border border-secondary" src={result} alt="Image failed to load" />
        </div>
      </div>

      <div className="mt-2">
        <p>
          When the study is complete, you can click the <a className="text-decoration-none">Download results</a> link to
          download the results file with the association statistics.
        </p>
      </div>

      <h4 className="my-4 fw-normal">Conclusion</h4>
      <div className="row">
        <p>
          Congratulations! You have successfully completed Tutorial 1. You should now have a better understanding of how
          to configure and execute a study using our platform. Feel free to explore other workflows and data types or to
          use the platform for your own research projects. We encourage you to also go through Tutorial 2, which will
          show you how to run a study with multiple participants.
        </p>
      </div>
    </div>
  );
};

export default PrimaryTutorial;
