import React from "react";
import TabNavigation from "../instructions/TabNavigation";

import { Link } from "react-router-dom";
import mpcgwas1 from "../../static/images/sample_parameters/mpcgwas1.png";
import mpcgwas2 from "../../static/images/sample_parameters/mpcgwas2.png";
import sfgwas1 from "../../static/images/sample_parameters/sfgwas1.png";
import sfgwas2 from "../../static/images/sample_parameters/sfgwas2.png";
import sfpca from "../../static/images/sample_parameters/sfpca.png";
import sfrelate from "../../static/images/sample_parameters/sfrelate.png";
import approveRequest from "../../static/images/tutorial/approve_request.png";
import pcaPrepareProject from "../../static/images/tutorial/pca_prepare_project.png";
import pcaUploadData from "../../static/images/tutorial/pca_upload_data.png";
import requestJoin from "../../static/images/tutorial/request_join.png";
import storageBucket from "../../static/images/tutorial/storage_bucket.png";

interface SectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SetUpYourStudySection: React.FC<SectionProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div>
      <h4 className="my-4 fw-normal">Set Up Your Study</h4>
      <div className="row">
        <p>
          User 1 should follow the steps in{" "}
          <Link to="/tutorials" target="_blank" className="text-decoration-none">
            Tutorial 1
          </Link>{" "}
          to{" "}
          <Link to="/studies" target="_blank" className="text-decoration-none">
            create
          </Link>{" "}
          their study. However, don't select "demo" this time (you can freely choose the other options)!
        </p>
        <p>
          For the parameters, each user will need to add their number of individuals (1252 each for this tutorial). User
          2 will do this later when they join the study. Once this is all done, the parameters should look like the
          following:
        </p>

        <div className="row p-4 bg-light rounded">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabType="workflow" />

          <div className="tab-content mt-3">
            <div
              className={`tab-pane fade ${activeTab === "data-mpcgwas" ? "show active" : ""}`}
              id="parameters-mpcgwas"
            >
              <div className="row justify-content-center mt-2">
                <div className="col-md-6 mb-4 mb-md-0">
                  <img className="img-fluid border border-secondary" src={mpcgwas1} alt="" />
                </div>
                <div className="col-md-6">
                  <img className="img-fluid border border-secondary" src={mpcgwas2} alt="" />
                </div>
              </div>
            </div>

            <div className={`tab-pane fade ${activeTab === "data-sfgwas" ? "show active" : ""}`} id="parameters-sfgwas">
              <div className="row justify-content-center mt-2">
                <div className="col-md-6 mb-4 mb-md-0">
                  <img className="img-fluid border border-secondary" src={sfgwas1} alt="" />
                </div>
                <div className="col-md-6">
                  <img className="img-fluid border border-secondary" src={sfgwas2} alt="" />
                </div>
              </div>
            </div>

            <div className={`tab-pane fade ${activeTab === "data-sfpca" ? "show active" : ""}`} id="parameters-sfpca">
              <div className="row justify-content-center mt-2">
                <div className="col-md-6">
                  <img className="img-fluid border border-secondary" src={sfpca} alt="" />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "data-sfrelate" ? "show active" : ""}`}
              id="parameters-sfrelate"
            >
              <div className="row justify-content-center mt-2">
                <div className="col-md-6">
                  <img className="img-fluid border border-secondary" src={sfrelate} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p>
            User 2 can then click the{" "}
            <button className="btn btn-outline-primary btn-sm" style={{ pointerEvents: "none" }}>
              Request to Join Study
            </button>{" "}
            button in the Studies page to request to join User 1's study.
          </p>
          <div className="text-center mb-2">
            <img className="img-fluid border border-secondary" style={{ maxWidth: "65%" }} src={requestJoin} alt="" />
          </div>
          <p>
            Once they have done so, User 1 can click the{" "}
            <button className="btn btn-outline-success btn-sm" style={{ pointerEvents: "none" }}>
              Approve Request
            </button>{" "}
            button to accept User 2 into their study.
          </p>
          <div className="text-center mb-2">
            <img
              className="img-fluid border border-secondary"
              style={{ maxWidth: "50%" }}
              src={approveRequest}
              alt=""
            />
          </div>
          <p>
            (Alternatively, User 1 can invite User 2 with the{" "}
            <button className="btn btn-outline-primary btn-sm" style={{ pointerEvents: "none" }}>
              Invite New Study Participant
            </button>{" "}
            button to send an invite link via email.)
          </p>
          <p>
            Then both users will follow the instructions to{" "}
            <button className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
              Configure Compute Environment
            </button>
            . Note that this will require the users to use their own GCP projects, in contrast to the first tutorial.
            (If you choose to use GCP's free trial, you can{" "}
            <a
              href="https://cloud.google.com/"
              target="_blank"
              className="text-decoration-none"
              rel="noopener noreferrer"
            >
              create a new project for free
            </a>
            . That said, this free GCP project has limited resource quotas, so you may need to use a different GCP
            project for each user. The expected GCP resource cost of this tutorial is ~$1.)
          </p>
          <div className="text-center mb-1">
            <img
              className="img-fluid border border-secondary"
              style={{ maxWidth: "100%" }}
              src={pcaPrepareProject}
              alt=""
            />
          </div>
          <p>
            Once the users have configured their GCP projects, they can upload their data to a GCP storage bucket. Note:
            you will need to unzip your data before uploading it.
          </p>
          <div className="text-center mb-2">
            <img
              className="img-fluid border border-secondary"
              style={{ maxWidth: "100%" }}
              src={pcaUploadData}
              alt=""
            />
          </div>
          <p>
            Note: You need to click the{" "}
            <button className="btn btn-primary btn-sm" style={{ pointerEvents: "none" }}>
              Save
            </button>{" "}
            button for your configuration changes to take effect.
          </p>
          <p>For reference, your GCP storage bucket might look something like this:</p>
          <div className="text-center">
            <img className="img-fluid border border-secondary" style={{ maxWidth: "75%" }} src={storageBucket} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetUpYourStudySection;
