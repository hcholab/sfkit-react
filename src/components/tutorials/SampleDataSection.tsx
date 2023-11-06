import React from "react";
import TabNavigation from "../instructions/TabNavigation";

interface SectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SampleDataSection: React.FC<SectionProps> = ({ activeTab, setActiveTab }) => {
  const BASE_URL = "https://storage.googleapis.com/sfkit_1000_genomes";

  return (
    <div>
      <h4 className="my-4 fw-normal">Sample Data</h4>
      <div className="row">
        <p>
          For this tutorial, we will use simulated data based on the{" "}
          <a href="https://www.internationalgenome.org/data/" className="text-decoration-none" target="_blank">
            1000 Genomes Dataset
          </a>
          . The genotypes are from real data, while the covariates and phenotypes are simulated for an illustrative GWAS
          analysis.
        </p>
        <p>
          To begin, each user should download a set of sample data by clicking the appropriate link below. Choose a
          workflow, and ensure each participant downloads one set of data. Explanation of the data format can be found
          in the{" "}
          <a
            href={`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/general.instructions#data_preparation`}
            className="text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data Preparation
          </a>{" "}
          section of the Instructions page.
        </p>
      </div>

      <div className="row p-4 bg-light rounded">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabType="workflow" />

        <div className="tab-content mt-3">
          <div
            className={`container tab-pane fade ${activeTab === "data-mpcgwas" ? "show active" : ""}`}
            id="data-mpcgwas"
          >
            <div className="d-flex justify-content-around align-items-center">
              <a className="btn btn-secondary" href={`${BASE_URL}/mpcgwas_p1.zip`}>
                Party 1 MPC-GWAS Sample Data
              </a>
              <a className="btn btn-secondary" href={`${BASE_URL}/mpcgwas_p2.zip`}>
                Party 2 MPC-GWAS Sample Data
              </a>
            </div>
          </div>
          <div
            className={`container tab-pane fade ${activeTab === "data-sfgwas" ? "show active" : ""}`}
            id="data-sfgwas"
          >
            <div className="d-flex justify-content-around align-items-center">
              <a className="btn btn-secondary" href={`${BASE_URL}/sfgwas_p1.zip`}>
                Party 1 SF-GWAS Sample Data
              </a>
              <a className="btn btn-secondary" href={`${BASE_URL}/sfgwas_p2.zip`}>
                Party 2 SF-GWAS Sample Data
              </a>
            </div>
          </div>
          <div className={`container tab-pane fade ${activeTab === "data-sfpca" ? "show active" : ""}`} id="data-sfpca">
            <div className="d-flex justify-content-around align-items-center">
              <a className="btn btn-secondary" href={`${BASE_URL}/pca_p1.zip`}>
                Party 1 SF-PCA Sample Data
              </a>
              <a className="btn btn-secondary" href={`${BASE_URL}/pca_p2.zip`}>
                Party 2 SF-PCA Sample Data
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDataSection;
