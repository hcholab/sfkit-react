import React, { useState } from "react";
import auth_image from "../../static/images/sfkit/auth.png";
import networking_image from "../../static/images/sfkit/networking.png";
import keys_image from "../../static/images/sfkit/keys.png";
import data_image from "../../static/images/sfkit/data.png";
import run_protocol_image from "../../static/images/sfkit/run_protocol.png";

interface Step {
  id: string;
  number: string;
  title: string;
  content: JSX.Element;
  imgSrc: string;
}

const steps: Step[] = [
  {
    id: "Authentication",
    number: "1",
    title: "Authentication",
    content: (
      <p>
        <b>{`1. Authentication`}</b>: Authenticate your machine with sfkit. This allows sfkit to ensure that the machine
        running the protocol is indeed yours. This is achieved by validating a secure key that is copied from the
        website to the machine.
      </p>
    ),
    imgSrc: auth_image,
  },
  {
    id: "Networking",
    number: "2",
    title: "Networking",
    content: (
      <p>
        <b>{`2. Networking`}</b>: Setup the networking for the machine. If you are running a{" "}
        <span className="badge bg-user-cfg">user-configured</span> study, you will be asked for the designated ports to
        use for the secure connections used by the protocol. Then, your IP address and ports will be shared with your
        collaborators via the sfkit portal.
      </p>
    ),
    imgSrc: networking_image,
  },
  {
    id: "KeyExchange",
    number: "3",
    title: "Key Exchange",
    content: (
      <p>
        <b>{`3. Key Exchange`}</b>: Cryptographically secure private and public keys will be created (locally) for you.
        The public key will be shared with your collaborators via the sfkit portal. The private key will remain on your
        machine and will be used during the study protocol to establish secure connections between machines. See{" "}
        <a href="https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange" className="text-decoration-none">
          Diffie-Hellman Key Exchange
        </a>{" "}
        for more information.
      </p>
    ),
    imgSrc: keys_image,
  },
  {
    id: "DataValidation",
    number: "4",
    title: "Data Validation",
    content: (
      <p>
        <b>{`4. Data Validation`}</b>: Validate that the data you provided is in the correct format and is consistent
        with the study parameters you provided. This step does NOT communicate any of the data externally and only
        reports the validation result back to the sfkit portal to assess when the study is ready to be launched.
      </p>
    ),
    imgSrc: data_image,
  },
  {
    id: "RunProtocol",
    number: "5",
    title: "Run Protocol",
    content: (
      <p>
        <b>{`5. Run Protocol`}</b>: Run the collaborative analysis protocol that you have chosen. Your machine will use
        the ports and IP addresses provided in Step 2 to securely communicate with collaborators' machines. This step
        may take several hours depending on the study workflow and the dataset sizes. The results of the protocol can be
        conveniently accessed in the output location or via the portal if you have given sfkit permission to fetch
        results for you.
      </p>
    ),
    imgSrc: run_protocol_image,
  },
];

const ProcessSteps: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string>("");
  const [hoveredStep, setHoveredStep] = useState<string>("");

  return (
    <div>
      <div className="row justify-content-around">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`col-6 col-md-2 my-3 btn d-flex align-items-stretch ${
              hoveredStep === step.id ? "border border-secondary" : ""
            }`}
            onMouseEnter={() => {
              setHoveredStep(step.id);
              setActiveStep(step.id);
            }}
            onMouseLeave={() => setHoveredStep("")}
          >
            <div className="position-relative p-4 text-center bg-light rounded">
              <span
                className="d-flex justify-content-center align-items-center position-absolute top-0 start-50 translate-middle rounded-circle bg-primary text-white"
                style={{ width: "32px", height: "32px", fontSize: "0.8rem" }}
              >
                {step.number}
              </span>
              <h6 className="fw-bold mb-2">{step.title}</h6>
              <img className="img-fluid" src={step.imgSrc} alt={step.title} />
            </div>
          </div>
        ))}
      </div>

      {steps.map((step) => (
        <div className="row" key={step.id} id={step.id} style={{ display: activeStep === step.id ? "block" : "none" }}>
          <div className="card card-body">{step.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ProcessSteps;
