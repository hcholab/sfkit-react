import * as React from "react";

const Contact: React.FC = () => {
  return (
    <section className="py-5">
      <div className="container col-12 col-lg-6" style={{ textAlign: "left" }}>
        <h2 className="mb-4 text-center fw-normal">Contact Us</h2>
        <hr />
        <h4 className="mt-4">Email</h4>
        <p>
          If you have any questions or comments, we would be happy to hear from you. To get in touch with our team,
          please reach us at
          <a className="text-decoration-none" href="mailto:support@sfkit.org">
            {" "}
            support@sfkit.org
          </a>
          .
        </p>

        <h4 className="mt-4">Source Code</h4>
        <div>
          <p>
            Our source code is all available on GitHub for anyone interested in learning more about our project or
            contributing to its development. You can find our repositories by following the links below:
          </p>
          <ul>
            <li>
              <a href="https://github.com/hcholab/sfkit-website" className="text-decoration-none">
                https://github.com/hcholab/sfkit-website
              </a>{" "}
              - the source code for this website
            </li>
            <li>
              <a href="https://github.com/hcholab/sfkit" className="text-decoration-none">
                https://github.com/hcholab/sfkit
              </a>{" "}
              - the source code for the sfkit CLI
            </li>
            <li>
              <a href="https://github.com/hcholab/sfgwas" className="text-decoration-none">
                https://github.com/hcholab/sfgwas
              </a>{" "}
              - the source code for the secure-federated GWAS and PCA
            </li>
            <li>
              <a href="https://github.com/hcholab/secure-gwas" className="text-decoration-none">
                https://github.com/hcholab/secure-gwas
              </a>{" "}
              - the source code for the MPC-GWAS
            </li>
          </ul>
        </div>

        <h4 className="mt-4">Related Publications</h4>
        <div>
          <p>
            Our project has been documented in several research articles. For a more detailed understanding of our work,
            you can access these articles via the links below:
          </p>
          <ul>
            <li>
              <a
                href="https://academic.oup.com/nar/advance-article/doi/10.1093/nar/gkad464/7184156"
                className="text-decoration-none"
              >
                sfkit: a web-based toolkit for secure and federated genomic analysis
              </a>{" "}
              (Nucleic Acids Research, 2023): This article provides an overview of the entire sfkit project.
            </li>
            <li>
              <a href="https://www.nature.com/articles/nbt.4108" className="text-decoration-none">
                Secure Genome-wide Association Analysis Using Multiparty Computation
              </a>{" "}
              (Nature Biotechnology, 2018): This paper introduces the MPC-GWAS workflow.
            </li>
            <li>
              <a href="https://www.nature.com/articles/s41467-021-25972-y" className="text-decoration-none">
                Truly Privacy-Preserving Federated Analytics for Precision Medicine with Multiparty Homomorphic
                Encryption
              </a>{" "}
              (Nature Communications, 2021): This paper details the SF-GWAS workflow.
            </li>
            <li>
              <a href="https://www.biorxiv.org/content/10.1101/2022.11.30.518537v1" className="text-decoration-none">
                Secure and Federated Genome-Wide Association Studies for Biobank-Scale Datasets
              </a>{" "}
              (Preprint): This paper outlines recent enhancements to the SF-GWAS workflow.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Contact;
