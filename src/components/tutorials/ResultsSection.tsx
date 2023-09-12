import React from "react";
import TabNavigation from "../instructions/TabNavigation";

import resultsMpcgwas from "../../static/images/tutorial/results_mpcgwas_1kg.png";
import resultsPca from "../../static/images/tutorial/results_pca_1kg.png";
import resultsSfgwas from "../../static/images/tutorial/results_sfgwas_1kg.png";

interface SectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ResultsSection: React.FC<SectionProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div>
      <h4 className="my-4 fw-normal">Results</h4>
      <div className="row">
        <p>
          The expected runtime for this tutorial is approximately 2 hours (feel free to leave the study page and come
          back). When the study is complete, each user will be able to download the results file with the association
          statistics (or principal components, in the case of the PCA workflow) by clicking the "
          <a className="text-decoration-none">Download results</a>" link on their respective study pages.
        </p>

        <div className="row p-4 bg-light rounded">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabType="workflow" />

          <div className="tab-content mt-3">
            <div
              className={`container tab-pane fade ${activeTab === "data-mpcgwas" ? "show active" : ""}`}
              id="results-mpcgwas"
            >
              <div className="text-center">
                <img
                  className="img-fluid border border-secondary"
                  style={{ maxWidth: "75%" }}
                  src={resultsMpcgwas}
                  alt=""
                />
              </div>
            </div>

            <div
              className={`container tab-pane fade ${activeTab === "data-sfgwas" ? "show active" : ""}`}
              id="results-sfgwas"
            >
              <div className="text-center">
                <img
                  className="img-fluid border border-secondary"
                  style={{ maxWidth: "75%" }}
                  src={resultsSfgwas}
                  alt=""
                />
              </div>
            </div>

            <div
              className={`container tab-pane fade ${activeTab === "data-sfpca" ? "show active" : ""}`}
              id="results-sfpca"
            >
              <div className="text-center">
                <img
                  className="img-fluid border border-secondary"
                  style={{ maxWidth: "75%" }}
                  src={resultsPca}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
