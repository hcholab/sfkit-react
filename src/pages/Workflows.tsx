import React from "react";
import info_square from "../static/images/info-square.svg";

const Workflows: React.FC = () => {
  return (
    <section className="py-5">
      <div className="container col-12 col-lg-7">
        <h2 className="mb-4 text-center fw-normal">Collaborative Study Workflows</h2>
        <hr />

        <div className="bg-light p-4 mt-3 mx-auto">
          <h5>
            <img src={info_square} className="me-1 mb-1" width="20" height="20" alt="info-square" />
            What is secure computation and how do
            <b> sfkit </b> workflows use it?
          </h5>

          <p>
            Secure computation refers to cryptographic techniques for analyzing encrypted private data without
            disclosing sensitive information. Our workflows use these methods to ensure that each dataset remains
            private throughout the collaborative study. We use both
            <i> secure multiparty computation </i> (MPC) and
            <i> homomorphic encryption </i> (HE) techniques in the design of our workflows to support a range of use
            cases.
          </p>
        </div>

        <div>
          <h3 className="mt-5 my-4">Genome-Wide Association Study (GWAS)</h3>
          <p>
            GWAS is an essential study design in genetics for identifying genetic variants that are correlated with a
            biological trait of interest, such as disease status. Analyzing a large sample of individuals is important
            for detecting variants that are rare or weakly associated with the trait. Our workflows below perform a GWAS
            jointly over datasets held by a group of collaborators to increase the power of the study, while keeping the
            input datasets private.
          </p>
        </div>

        <div>
          <h4 className="my-4 fw-normal">MPC-GWAS</h4>
          <p>
            This workflow implements a collaborative GWAS protocol based on secure multiparty computation (MPC) as
            described in{" "}
            <a
              className="text-decoration-none"
              href="https://www.nature.com/articles/nbt.4108"
              target="_blank"
              rel="noopener noreferrer"
            >
              Secure Genome-wide Association Analysis Using Multiparty Computation
            </a>{" "}
            (Nature Biotechnology, 2018). It provides a standard GWAS pipeline including quality control filters (for
            missing data, allele frequencies, and Hardy-Weinberg equilibrium), population stratification analysis (based
            on principal component analysis), and association tests.
          </p>

          <p>
            Each user provides an input dataset including genotypes, covariates, and a target phenotype for a local
            cohort of individuals. These data are encrypted and split into multiple copies (<i>secret shares</i> in MPC
            terminology), which are then distributed to collaborators before running the joint analysis. Unencrypted
            data is not shared with a server.
          </p>

          <p>
            This workflow currently supports joint analyses between pairs of collaborators. For studies involving more
            than two users, please use the SF-GWAS workflow.
          </p>
        </div>

        <div>
          <h4 className="my-4 fw-normal">SF-GWAS</h4>
          <p>
            This workflow implements a secure and federated (SF) protocol for collaborative GWAS, meaning that each
            input dataset remains with the data holder and only a smaller amount of intermediate results are exchanged
            in an encrypted form. Unlike MPC-GWAS, even the encrypted input dataset is never shared to minimize the
            computational overhead. Our federated GWAS algorithm is introduced in{" "}
            <a
              className="text-decoration-none"
              href="https://www.nature.com/articles/s41467-021-25972-y"
              target="_blank"
              rel="noopener noreferrer"
            >
              Truly Privacy-Preserving Federated Analytics for Precision Medicine with Multiparty Homomorphic Encryption
            </a>{" "}
            (Nature Communications, 2021). Further improvements and extensions in a recent{" "}
            <a
              className="text-decoration-none"
              href="https://www.biorxiv.org/content/10.1101/2022.11.30.518537v1"
              target="_blank"
              rel="noopener noreferrer"
            >
              preprint
            </a>{" "}
            are also incorporated to provide the state-of-the-art performance. Similar to MPC-GWAS, this GWAS pipeline
            includes quality control filters, population stratification analysis, and association tests.
          </p>

          <p>
            Each user provides an input dataset including genotypes, covariates, and a target phenotype for a local
            cohort of individuals. The joint analysis protocol makes an efficient use of local computation on the
            unencrypted data while ensuring that only encrypted intermediate results are shared among the users.
          </p>
        </div>

        <div>
          <h3 className="mt-5 my-4">Principal Component Analysis (PCA)</h3>
          <p>
            PCA is a standard algorithm for dimensionality reduction. In genetics, PCA is commonly applied to the
            genotype data to identify the population structure of a given sample group. Coordinates of each individual
            in a reduced space output by PCA represent their ancestry background in relation to other individuals. This
            information is useful for genetic analyses, for example for constructing additional covariates in GWAS.
          </p>
        </div>

        <div>
          <h4 className="my-4 fw-normal">SF-PCA</h4>
          <p>
            This workflow allows a group of users to perform a PCA jointly on their private datasets to obtain a desired
            number of top principal components (PCs) without sharing the data. This corresponds to one of the steps in
            GWAS workflows described above, here provided as a standalone workflow, based on the secure and federated
            (SF) approach. Each user provides a matrix with the same number of columns (features) as the input. The
            workflow securely computes and returns the PCs of the pooled matrix while keeping any sensitive data
            encrypted at all times.
          </p>
        </div>

        <div>
          <h3 className="mt-5 my-4">Discovery of Genetic Relatives</h3>
          <p>
            Using genetic data to identify familial relationships between individuals is a common task in genetics that
            has important implications for both research and personal genomics.
          </p>
        </div>
        <div>
          <h4 className="my-4 fw-normal">SF-RELATE</h4>
          <p>
            SF-RELATE stands for Secure and Federated Genetic Relatives Detection. This workflow is part of our suite of
            privacy-preserving genetic analysis tools, specifically designed to estimate familial relationships between
            individuals across different datasets. Like our other SF workflows, SF-RELATE operates under the principle
            that data privacy is paramount. It allows for the secure comparison of genetic information to infer
            relationships such as parent-child, siblings, or more distant relations, without ever exposing the raw
            genetic data to other parties. By leveraging both secure multiparty computation (MPC) and homomorphic
            encryption (HE), SF-RELATE ensures that all analyses are conducted on encrypted data, providing a powerful
            tool for researchers and individuals looking to explore genetic relationships securely.
          </p>
        </div>

        <div>
          <h4 className="my-4 fw-normal">Secure-DTI</h4>
          <p>
            This workflow implements a collaborative Secure DTI protocol based on secure multiparty computation (MPC) as
            described in{" "}
            <a
              className="text-decoration-none"
              href="https://www.science.org/doi/10.1126/science.aat4807"
              target="_blank"
              rel="noopener noreferrer"
            >
              Realizing private and practical pharmacological collaboration
            </a>{" "}
            (Science, 2018).
          </p>

          <p>
            Each user provides an input dataset. These data are encrypted and split into multiple copies (<i>secret shares</i> in MPC
            terminology), which are then distributed to collaborators before running the joint analysis. Unencrypted
            data is not shared with a server.
          </p>

          <p>
            This workflow currently supports joint analyses between pairs of collaborators.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Workflows;
