import React from "react";

interface TabContentProps {
  activeTab: string;
  tabType: "workflow" | "config";
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, tabType }) => {
  return (
    <div className="row tab-content">
      {tabType === "workflow" ? (
        <>
          {/* Workflow content */}
          <div
            className={`container tab-pane fade ${activeTab === "data-mpcgwas" ? "show active" : ""}`}
            id="data-mpcgwas"
          >
            <div className="row mt-3">
              <p>
                For GWAS, each user holds a portion of the horizontally distributed input genotype matrix (in which each
                row is a data sample and the features correspond to SNPs), covariate matrix and phenotype vector. These
                users' local files must be named and formatted as follows:
              </p>
              <div>
                <ul>
                  <li>
                    <code>geno.txt</code> - The genotype matrix, or minor allele dosage matrix, is stored as a
                    tab-separated file in which the SNP values (i.e., features) are encoded as genotype scores (i.e., as
                    0, 1, or 2).
                  </li>
                  <li>
                    <code>pos.txt</code> - This file must accompany the genotype matrix and stores the genomic positions
                    of the SNPs in a 2-columns file where each row contains the chromosome number and the position in
                    the chromosome of the corresponding SNP, separated by a tabulation.
                  </li>
                  <li>
                    <code>cov.txt</code> - A tab-separated file storing the covariate matrix in which each row is a
                    sample, and each column is a covariate, e.g., patient older than 50 years old. We assume all
                    covariates are binary.
                  </li>
                  <li>
                    <code>pheno.txt</code> - The phenotype vector, e.g., containing the infection status of each
                    patient, is stored in a single-column file.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            className={`container tab-pane fade ${activeTab === "data-sfgwas" ? "show active" : ""}`}
            id="data-sfgwas"
          >
            <div className="row mt-3">
              <p>
                For this workflow, the input data are similar to those in the previous workflow, except for the
                following differences:
              </p>
              <div>
                <ul>
                  <li>
                    <code>geno/chr[1-22].[pgen|psam|pvar]: </code>
                    The genotype or minor allele dosage matrix is encoded using the PGEN file format for each
                    chromosome. This format has been introduced in the standard
                    <a className="text-decoration-none" href="https://www.cog-genomics.org/plink/2.0/formats">
                      PLINK2
                    </a>
                    tool for genomic data processing as an efficient way to store large-scale genomic datasets. Note
                    that this file encodes the genomic positions of the SNPs directly.
                  </li>
                  <li>
                    <code>sample_keep.txt: </code>
                    This file accompanies the genotype matrix and lists the sample IDs from the .psam file to include in
                    the analysis. This file is required to comply with the standard format proposed in PLINK2 (see the
                    --keep option in the PLINK2 documentation).
                  </li>
                  <li>
                    <code>pheno.txt: </code>
                    As before, each line includes the phenotype under study for each sample.
                  </li>
                  <li>
                    <code>cov.txt: </code>
                    Each line includes a tab-separated list of covariates for each sample. Unlike in the previous
                    workflow, the covariates and phenotypes in this workflow are not required to be binary.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={`container tab-pane fade ${activeTab === "data-sfpca" ? "show active" : ""}`} id="data-sfpca">
            <div className="row mt-3">
              <p>
                Each user data, consisting in an horizontal partition of the input matrix (in which the rows are the
                data samples and the columns correspond to the features) must be locally stored as a single
                tab-separated file called
                <code> data.txt</code>.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Config content */}
          <div
            className={`container tab-pane fade ${activeTab === "Auto-configured" ? "show active" : ""}`}
            id="Auto-configured"
          >
            <div className="row mt-3">
              <p>
                The sfkit portal will set up the machine and run the study for you. This option is currently supported
                using the
                <a
                  className="text-decoration-none"
                  href="https://cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Google Cloud Platform (GCP)
                </a>
                . You will need to give sfkit limited permissions to interact with your GCP project. You will be walked
                through the specifics of this process once you create a study with this option.
              </p>
              <p>
                This is recommended for users who are not familiar with the command line and/or want to get started
                quickly.
              </p>
            </div>
          </div>
          <div
            className={`container tab-pane fade ${activeTab === "User-configured" ? "show active" : ""}`}
            id="User-configured"
          >
            <div className="row mt-3">
              <p>
                The{" "}
                <a
                  className="text-decoration-none"
                  href="https://sfkit.readthedocs.io/en/latest/tutorial.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  sfkit Command-Line Interface
                </a>{" "}
                will walk you through each step of the workflow so you can run the study on your own machine.
              </p>
              <p>
                This is recommended for users who are familiar with the command line and want to directly control their
                computing environment.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TabContent;
