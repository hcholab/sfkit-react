import React, { useState } from "react";
import SampleDataSection from "./SampleDataSection";
import SetUpYourStudySection from "./SetUpYourStudySection";
import ResultsSection from "./ResultsSection";

const TwoPersonTutorial: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("data-sfpca");

  return (
    <div>
      <div>
        <b className="text-muted">
          Note: This tutorial uses the <span className="badge bg-auto-cfg">auto-configured</span> option. There is an
          equivalent tutorial for the <span className="badge bg-user-cfg">user-configured</span> option in the{" "}
          <a
            className="text-decoration-none"
            href="https://sfkit.readthedocs.io/en/latest/tutorial_2.html"
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
          This two-person tutorial is designed to guide you and a partner through the process of running a study using
          real genomic data. You'll both download sample data, configure your respective parts of the study, and execute
          a workflow together. For the purposes of this tutorial, we will refer to the two users as "User 1" and "User
          2".
        </p>
        <p className="text-muted">
          Tip: We do recommend that you go through Tutorial 1 first, as this tutorial will assume you have some
          familiarity with the platform.
        </p>
        <span className="text-muted">
          Note: You can complete this tutorial on your own, but it's designed for two separate users. To achieve this,
          you can use various methods such as opening an incognito window for the second participant, using two
          different browser profiles, or using two distinct browsers.
        </span>
      </div>
      <SampleDataSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <SetUpYourStudySection activeTab={activeTab} setActiveTab={setActiveTab} />

      <h4 className="my-4 fw-normal">Execute the Workflow</h4>
      <div className="row">
        <p>
          Once both users have configured their parts of the study, each user should click the{" "}
          <span className="btn btn-success btn-sm" style={{ pointerEvents: "none" }}>
            Begin PCA Workflow
          </span>{" "}
          button (or the equivalent for a different workflow) on their respective study pages (this is the same as in
          Tutorial 1). The study will run, and you'll be able to see its status on the study page. You may also inspect
          the newly created VM in your GCP project.
        </p>
      </div>

      <ResultsSection activeTab={activeTab} setActiveTab={setActiveTab} />

      <h4 className="my-4 fw-normal">Conclusion</h4>
      <div className="row">
        <p>
          Congratulations! You have successfully completed Tutorial 2. You should now have a better understanding of how
          to configure and execute a study with a partner using our platform. Feel free to explore other workflows and
          data types or to use the platform for your own research projects.
        </p>
      </div>
    </div>
  );
};

export default TwoPersonTutorial;
