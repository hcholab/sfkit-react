import React, { useState } from "react";

type WorkflowType = "mpcgwas" | "sfgwas" | "sfpca" | "sfrelate" | "securedti";
const workflows: WorkflowType[] = ["mpcgwas", "sfgwas", "sfpca", "sfrelate", "securedti"];

type SelectionsType = {
  [key in WorkflowType]: {
    rows: number;
    cols: number;
  };
};

const recommendations: { [key: number]: string } = {
  1: "e2-highmem-16 with at least a 128 GB boot disk (estimated cost of $0.75/hour).",
  2: "n2-highmem-32 with at least a 256 GB boot disk (estimated cost of $1.75/hour).",
  3: "n2-highmem-64 with at least a 512 GB boot disk (estimated cost of $3.50/hour).",
  4: "n2-highmem-128 with at least a 1024 GB boot disk (estimated cost of $6.50/hour).",
};

const MachineRecommendation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("mpcgwas");
  const [selections, setSelections] = useState<SelectionsType>({
    mpcgwas: { rows: 0, cols: 0 },
    sfgwas: { rows: 0, cols: 0 },
    sfpca: { rows: 0, cols: 0 },
    sfrelate: { rows: 0, cols: 0 },
    securedti: { rows: 0, cols: 0 },
  });

  const recommendMachine = (workflow: string) => {
    const { rows, cols } = selections[workflow as keyof SelectionsType];
    const selection = Math.max(rows, cols, 1);
    const base =
      rows === 0 && cols === 0
        ? "The default recommendation is an "
        : "Based on your selection, we recommend you use an ";
    return base + recommendations[selection];
  };

  return (
    <section id="machine_recommendations">
      <h4 className="my-4 fw-normal">Machine Recommendations</h4>
      <p>
        If you are unsure what machine size or type to use for your study, you can use this tool to see our
        recommendation. Note that this guidance is based on the machines that are available on the Google Cloud
        Platform, but equivalent machines can be used instead.
      </p>
      <div className="row p-4 bg-light rounded">
        <ul className="nav nav-tabs">
          {workflows.map((workflow) => (
            <li key={workflow} className="nav-item">
              <button
                className={`nav-link ${activeTab === workflow ? "active" : ""}`}
                onClick={() => setActiveTab(workflow)}
              >
                {workflow.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toUpperCase()} workflow
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content">
          {workflows.map((workflow) => (
            <div
              key={workflow}
              className={`tab-pane fade ${activeTab === workflow ? "show active" : ""}`}
              role="tabpanel"
            >
              {workflow !== "sfrelate" ? (
                <div className="row mt-3">
                  <div className="col-6">
                    <select
                      className="form-select"
                      value={selections[workflow].rows}
                      onChange={(e) => {
                        setSelections((prev) => ({
                          ...prev,
                          [workflow]: { ...prev[workflow], rows: parseInt(e.target.value) },
                        }));
                      }}
                    >
                      <option value="0">Approximately how many samples/individuals are in your dataset?</option>
                      <option value="1">fewer than 30,000</option>
                      <option value="2">30,000 - 100,000</option>
                      <option value="3">100,000 - 500,000</option>
                      <option value="4">more than 500,000</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <select
                      className="form-select"
                      value={selections[workflow].cols}
                      onChange={(e) => {
                        setSelections((prev) => ({
                          ...prev,
                          [workflow]: { ...prev[workflow], cols: parseInt(e.target.value) },
                        }));
                      }}
                    >
                      <option value="0">Approximately how many SNPs/rows/columns are in your dataset?</option>
                      <option value="1">fewer than 700,000</option>
                      <option value="2">700,000 - 10,000,000</option>
                      <option value="3">10,000,000 - 30,000,000</option>
                      <option value="4">more than 30,000,000</option>
                    </select>
                  </div>
                  <div className="col mt-3">
                    <div className="card card-body">{recommendMachine(workflow)}</div>
                  </div>
                </div>
              ) : (
                <div className="row mt-3">
                  <p>
                    For the SF-Relate workflow, we generally recommend the n2-highmem-128 machines (estimated cost of
                    $6.50/hour).
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MachineRecommendation;
