import React, { useState } from "react";
import { Link } from "react-router-dom";
import MachineRecommendation from "../components/instructions/MachineRecommendation";
import ProcessSteps from "../components/instructions/ProcessSteps";
import TabContent from "../components/instructions/TabContent";
import TabNavigation from "../components/instructions/TabNavigation";
import { useTerra } from "../hooks/useTerra";
import info_square from "../static/images/info-square.svg";

const Instructions: React.FC = () => {
  const { onTerra } = useTerra();
  const [activeTab1, setActiveTab1] = useState<string>("data-mpcgwas");
  const [activeTab2, setActiveTab2] = useState<string>("Auto-configured");

  return (
    <section className="py-5">
      <div className="container col-12 col-lg-7">
        <h2 className="mb-4 text-center fw-normal">Instructions</h2>
        <hr />

        <div className="bg-light p-4 mt-3 mx-auto">
          <h5>
            <img src={info_square} className="me-1 mb-1" width="20" height="20" alt="info-square" />
            Two ways to use <b>sfkit</b>
          </h5>
          <p>
            Once the study is configured on the website, you can launch it in two different modes:
          </p>
          { onTerra && (
            <>
              <p>
                1. You can upload data to your Terra workspace through Terra or sfkit portal, and then
                let sfkit automatically launch an analysis workflow in that Terra workspace.
              </p>

              <p>
                2. You can easily launch the protocol manually either inside a Terra interactive analysis machine,
                or on your own machine outside of Terra, using the sfkit command-line interface (CLI).
              </p>
            </>
          ) || (
            <>
              <p>
                1. You can let sfkit automatically create the computing environment and deploy the joint
                analysis protocol on the Google Cloud Platform (GCP). To allow this automation, sfkit will ask for a minimal
                set of permissions in your GCP project.
              </p>

              <p>
                2. You can easily launch the protocol on your own machine (and your collaborators on their machines) using the sfkit
                command-line interface (CLI).
              </p>
            </>
          )}
        </div>

        {/* Prerequisites Section */}
        <div className="row">
          <h4 className="my-4 fw-normal">Prerequisites</h4>
          <p>
            To run a study using <b>sfkit</b>, you will need either:
          </p>
          <div>
            <ol>
              <li>
                A Google Cloud Platform (GCP) account that can create and manage virtual machines (VMs) in the cloud.
              </li>
              <li>
                A machine of your own with a network connection, if you are running a{" "}
                <span className="badge bg-user-cfg">user-configured</span> study.
              </li>
            </ol>

            <p>
              See <i>Machine Recommendations</i> on the bottom of this page for guidance on machine types.
            </p>

            <span className="text-muted">
              Note: For the{" "}
              <Link to="/tutorials" className="text-decoration-none">
                Tutorial
              </Link>
              , you can use our GCP project and example data for testing purposes.
            </span>
          </div>
        </div>

        <div id="data_preparation">
          <h4 className="my-4 fw-normal">Data Preparation</h4>

          <div className="row p-4 bg-light rounded">
            <TabNavigation activeTab={activeTab1} setActiveTab={setActiveTab1} tabType="workflow" />
            <TabContent activeTab={activeTab1} tabType="workflow" />
          </div>
        </div>

        {/* Getting Started Section */}
        <div>
          <h4 className="my-4 fw-normal">Getting Started</h4>
          <p>
            When you are ready to run a study, go to{" "}
            <Link to="/studies" className="text-decoration-none">
              Studies
            </Link>{" "}
            to create or join a study.
          </p>

          <div>
            <p>If you are creating a study, you will need to:</p>
            <ul>
              <li>
                Choose one of our{" "}
                <Link to="/workflows" className="text-decoration-none">
                  Workflows
                </Link>{" "}
                for the study.
              </li>
              <li>
                Specify whether you want the study to be <span className="badge bg-auto-cfg">auto-configured</span> or{" "}
                <span className="badge bg-user-cfg">user-configured</span> (described below).
              </li>
              <li>Edit your study parameters.</li>
            </ul>
          </div>
          <p>
            If you are joining a study, you will only need to review and update the study parameters to provide
            information about your dataset.
          </p>
        </div>

        {/* Configuration Options Section */}
        <div>
          <h4 className="my-4 fw-normal">Configuration Options</h4>

          <div className="row p-4 bg-light rounded">
            <TabNavigation activeTab={activeTab2} setActiveTab={setActiveTab2} tabType="config" />
            <TabContent activeTab={activeTab2} tabType="config" />
          </div>
        </div>

        <ProcessSteps />

        <MachineRecommendation />
      </div>
    </section>
  );
};

export default Instructions;
