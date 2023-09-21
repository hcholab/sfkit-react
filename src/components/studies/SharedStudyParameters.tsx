import React from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import { Study } from "../../types/study";

interface SharedStudyParametersProps {
  study: Study;
  isOwner: boolean;
  userId: string;
}

const SharedStudyParameters: React.FC<SharedStudyParametersProps> = ({ study, isOwner, userId }) => {
  return (
    <Row className="p-3 text-start">
      {study.participants.map((participant) =>
        participant !== "Broad" ? (
          <React.Fragment key={participant}>
            <Form.Label column htmlFor={`NUM_INDS${participant}`} className="col-form-label">
              Number of Individuals for {study["display_names"][participant]}
            </Form.Label>
            <Col sm="3">
              <Form.Control
                type="text"
                id={`NUM_INDS${participant}`}
                name={`NUM_INDS${participant}`}
                defaultValue={study.personal_parameters[participant]?.NUM_INDS?.value}
                disabled={userId !== participant}
              />
            </Col>
            <p className="mt-1 text-start text-muted">
              Number of Individuals/Rows in {study["display_names"][participant]}'s Data
            </p>
          </React.Fragment>
        ) : null
      )}
      {!isOwner && (
        <p>
          <b>Note: Only the creator of the study can edit the Shared Study Parameters.</b>
        </p>
      )}
      {study.parameters.index.map((parameterName) => (
        <React.Fragment key={parameterName}>
          <Form.Label column htmlFor={parameterName} className="col-form-label">
            {study.parameters[parameterName].name}
          </Form.Label>
          <Col sm="3">
            <Form.Control
              type={parameterName === "skip_qc" ? "text" : "number"}
              id={parameterName}
              name={parameterName}
              min="0"
              step="any"
              defaultValue={study.parameters[parameterName].value}
              disabled={!isOwner}
            />
          </Col>
          <p className="mt-1 text-start text-muted">{study.parameters[parameterName].description}</p>
        </React.Fragment>
      ))}
      <Accordion className="mb-3" id="advancedParameters">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Advanced Parameters</Accordion.Header>
          <Accordion.Body>
            {study.advanced_parameters.index.map((parameterName) => (
              <React.Fragment key={parameterName}>
                <Form.Floating className="mb-3">
                  <Form.Control
                    type="number"
                    id={parameterName}
                    name={parameterName}
                    min="0"
                    step="any"
                    defaultValue={study.advanced_parameters[parameterName].value}
                    disabled={!isOwner}
                  />
                  <Form.Label htmlFor={parameterName}>{study.advanced_parameters[parameterName].name}</Form.Label>
                </Form.Floating>
                <p className="text-start text-muted">{study.advanced_parameters[parameterName].description}</p>
              </React.Fragment>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Row>
  );
};

export default SharedStudyParameters;
