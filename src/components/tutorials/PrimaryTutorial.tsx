import React from "react";

const PrimaryTutorial: React.FC = () => {
  return (
    <div>
      <div>
        <b className="text-muted">
          Note: This tutorial uses the <span className="badge bg-auto-cfg">auto-configured</span> option. There is an
          equivalent tutorial for the <span className="badge bg-user-cfg">user-configured</span> option in the{" "}
          <a
            className="text-decoration-none"
            href="https://sfkit.readthedocs.io/en/latest/tutorial.html"
            target="_blank"
          >
            sfkit CLI documentation
          </a>
          .
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

      <h4 className="my-4 fw-normal">Creating a study</h4>
      <div className="row">
        <p>
          The first step is to create a study. To do this, go to the
          <a className="text-decoration-none" href="{{url_for('studies.index')}}">
            Studies
          </a>
          page and click
          <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Create New Study
          </span>
          <span className="text-muted">
            (In a real study, you could also choose to join someone else's study instead.)
          </span>
        </p>
        <p className="text-muted">
          Tip: We recommend following the tutorial steps in a separate browser tab. This way, you can easily switch
          between reading the instructions and performing the actions needed to create and run the study.
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-75 border border-secondary"
            src="static/images/tutorial/studies_index.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <div className="row">
        <p>You will now see a page that looks something like this:</p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-75 border border-secondary"
            src="static/images/tutorial/choose_workflow.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <div className="row">
        <p>
          You are given the option to choose among any of the 3 workflows and 2 configuration options. More details
          about these choices are available in the
          <a className="text-decoration-none" target="_blank" href="{{url_for('general.workflows')}}">
            workflows
          </a>
          and
          <a className="text-decoration-none" target="_blank" href="{{url_for('general.instructions')}}">
            instructions
          </a>
          . pages. For this tutorial, you can leave the defaults and then click
          <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Confirm
          </span>
          to continue.
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-75 border border-secondary"
            src="static/images/tutorial/choose_title.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <div className="row">
        <p>
          On the next page, you will be asked to provide a name for your study. Pick any unique study title, and you can
          leave the description and study information blank. Be sure to check the "Demo Study" option. Then proceed by
          clicking
          <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Confirm
          </span>
          again. You will now be taken to a page to set the "Shared Study Parameters". For the demo, you can leave all
          of the parameters as they are. In a real study, you would set the parameters according to your data and
          preferences. Click
          <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Submit
          </span>
          to proceed.
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-75 border border-secondary"
            src="static/images/tutorial/mpc_parameters.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <h4 className="my-4 fw-normal">Configuring your study</h4>
      <div className="row">
        <p>
          You should now see a page that looks something like this
          <span className="text-muted">
            (if you instead see the main study page, click the
            <button className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
              Configure Study
            </button>
            button to get to this page)
          </span>
          :
        </p>
      </div>
      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-75 border border-secondary"
            src="static/images/tutorial/prepare_project.png"
            alt="Image failed to load"
          />
        </div>
      </div>
      <div className="row">
        <p>
          0. When running a real study, you would need to follow the instructions to set up your GCP account. For the
          sake of this demo, these steps are optional, and the default configuration will run the demo on a GCP machine
          controlled by us. If you would like to run the demo on your own GCP account, you can follow the instructions.
          When you are done, you can click
          <span className="btn btn-success btn-sm" style={{ pointerEvents: "none" }}>
            Next
          </span>
          .
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-75 border border-secondary"
            src="static/images/tutorial/upload_data.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <div className="row">
        <p>
          1. For the GCP Project ID, either leave it as is to use our machines or enter whatever GCP project you chose
          in step 0. Either way, for the sake of the demo, you can ignore the data paths. In a real study, you would
          need to upload your data to a bucket in your GCP account and indicate the paths to said data here. Click
          <span className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Save
          </span>
          if you have made any changes. Once you are done with this step, you can click
          <span className="btn btn-success btn-sm" style={{ pointerEvents: "none" }}>
            Next
          </span>
          .
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-75 border border-secondary"
            src="static/images/tutorial/give_permissions.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <div className="row">
        <p>
          2. If you are using your own GCP project, please run the given command in your GCP cloud shell. This command
          will give the website permissions to set up the protocol for your study in your GCP project. Otherwise, you
          don't need to do anything here. Once you are done, you can click
          <span className="btn btn-success btn-sm" style={{ pointerEvents: "none" }}>
            Next
          </span>
          .
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-75 border border-secondary"
            src="static/images/tutorial/choose_vm_size.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <div className="row">
        <p>3. For the sake of this demo, you can leave the VM size as it is.</p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-75 border border-secondary"
            src="static/images/tutorial/post_processing.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <div className="row">
        <p>
          4. For the sake of this demo, you can leave these values as they are. You can click
          <span className="btn btn-success btn-sm" style={{ pointerEvents: "none" }}>
            Done
          </span>
          to proceed.
        </p>
      </div>

      <h4 className="my-4 fw-normal">Running your study</h4>
      <div className="row">
        <p>You should now see a page that looks something like this:</p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-50 border border-secondary"
            src="static/images/tutorial/study.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <div>
        <p>
          This is your main study page. Here you can see the status of your study, and you can download the results when
          the study is complete. You can also click the
          <button className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
            Configure Study
          </button>
          button to go back to the configuration page. This is also where you can view the study participants and add
          more participants to your study. When all participants initiate their study, the joint study will begin. For
          this demo, you are the only real participant.
        </p>
        <p>
          Click the
          <span className="btn btn-success btn-sm" style={{ pointerEvents: "none" }}>
            Begin MPC-GWAS Workflow
          </span>
          button to begin your study. The study should take about 1/2 hour to complete, and status updates will be
          visible on this page. Feel free to leave this page and come back. When the study is complete, a link to
          download the results should appear.
        </p>
      </div>

      <div className="row my-2">
        <div className="text-center">
          <img
            className="img-fluid w-50 border border-secondary"
            src="static/images/tutorial/result.png"
            alt="Image failed to load"
          />
        </div>
      </div>

      <div className="mt-2">
        <p>
          When the study is complete, you can click the
          <a className="text-decoration-none">Download results</a>
          link to download the results file with the association statistics.
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
