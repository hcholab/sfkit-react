import * as React from 'react';
import sfkit_cover from '../static/images/sfkit-cover.png';

const Home: React.FC = () => {
    const keyFeatures = [
        { title: "Privacy", description: "Cryptographic analysis protocols keep datasets provably private" },
        { title: "Accuracy", description: "Study results are comparable to analyzing a pooled dataset" },
        { title: "Scalability", description: "Advanced optimizations enable analysis of biobank-scale datasets" },
    ];

    const featuredWorkflows = [
        { title: "Genome-Wide Association Study (GWAS)", description: "Identify genetic variants linked to diseases or health-related traits across multiple datasets" },
        { title: "Principal Component Analysis (PCA)", description: "Obtain a unified representation of genetic ancestry of individuals in multiple datasets" },
    ];

    const generalProcesses = [
        { title: "Join", description: "Create or join a study with your collaborators" },
        { title: "Configure", description: "Set your desired parameters and study workflow" },
        { title: "Run", description: "Run the study — visualize and share your results" },
    ];

    return (
        <section className="py-5">
            <div className="container">
                <div className="row">
                    <h1 className="mb-4 text-center fw-normal">
                        <b>sfkit</b>: Secure Collaborative Genomics Portal
                    </h1>
                    <div className="col-12 col-lg-9 mx-auto">
                        <h5 className="mb-5 text-center fw-normal">
                            Unlocking biomedical discoveries through privacy-preserving collaboration
                        </h5>
                        <div className="row">
                            <div className="text-center mb-5">
                                <img className="img-fluid w-75" src={sfkit_cover} alt="Failed to load" />
                            </div>
                        </div>
                    </div>
                </div>

                { /* Key Features Section */ }
                <div className="row">
                    <h2 className="text-center fw-normal">Key Features of <b>sfkit</b></h2>
                    {keyFeatures.map((feature, index) => (
                        <div key={index} className="col my-5 d-flex align-items-stretch">
                            <div className="p-5 text-center bg-light rounded">
                                <h4 className="fw-bold mb-3">{feature.title}</h4>
                                <p className="lead text-muted">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                { /* Featured Workflows Section */ }
                <div className="row mt-3">
                    <h2 className="text-center fw-normal">Featured Workflows</h2>
                    {featuredWorkflows.map((workflow, index) => (
                        <div key={index} className="col my-5 d-flex align-items-stretch">
                            <div className="p-5 text-center bg-light rounded">
                                <h4 className="fw-bold mb-3">{workflow.title}</h4>
                                <p className="lead text-muted">{workflow.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                { /* General Process Section */ }
                <div className="row mt-3">
                    <h2 className="text-center fw-normal">General Process</h2>
                    {generalProcesses.map((process, index) => (
                        <div key={index} className="col my-5 d-flex align-items-stretch">
                            <div className="position-relative p-5 text-center bg-light rounded">
                                <span className="d-flex justify-content-center align-items-center position-absolute top-0 start-50 translate-middle rounded-circle bg-primary text-white" style={{width: '48px', height: '48px'}}>{index + 1}</span>
                                <h4 className="fw-bold mb-3">{process.title}</h4>
                                <p className="lead text-muted">{process.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row mt-3">
                    <h2 className="text-center fw-normal">Ready to Start?</h2>
                    <div className="col my-5">
                        <div className="position-relative text-center rounded">
                            <p className="lead">
                                Review our <a className="text-decoration-none" href="/workflows">Workflows</a> and <a className="text-decoration-none" href="/instructions">Instructions</a> to learn more about the process
                            </p>
                        </div>
                    </div>
                    <div className="col my-5">
                        <div className="position-relative text-center rounded">
                            <p className="lead">
                                Try out our <a className="text-decoration-none" href="/tutorial">Tutorial</a> to see <b>sfkit</b> in action
                            </p>
                        </div>
                    </div>
                    <div className="col my-5">
                        <div className="position-relative text-center rounded">
                            <p className="lead">
                                Go to <a className="text-decoration-none" href="/studies">Studies</a> to create or join a study
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Home;
