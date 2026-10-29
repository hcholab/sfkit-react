import React from "react";
import { Accordion, Col, Form, Row } from "react-bootstrap";
import { Parameter, Study } from "../../types/study";
import { parameterType } from "../../utils/formUtils";

interface SharedStudyParametersProps {
  study: Study;
  isOwner: boolean;
  userId?: string;
}

interface ParameterControlProps {
  parameter: Parameter;
  parameterName: string;
  disabled: boolean;
  required?: boolean;
}

// Renders the form control matching the parameter's type: a No/Yes select for booleans (whose value
// is submitted as the string "false"/"true"), otherwise a text or number input.
const ParameterControl: React.FC<ParameterControlProps> = ({ parameter, parameterName, disabled, required }) => {
  const type = parameterType(parameter);

  if (type === "boolean") {
    return (
      <Form.Select id={parameterName} name={parameterName} defaultValue={String(parameter.value)} disabled={disabled}>
        <option value="false">No</option>
        <option value="true">Yes</option>
      </Form.Select>
    );
  }

  return (
    <Form.Control
      type={type}
      id={parameterName}
      name={parameterName}
      {...(type === "number" && { min: "0", step: "any" })}
      defaultValue={parameter.value}
      disabled={disabled}
      required={required}
    />
  );
};

const SharedStudyParameters: React.FC<SharedStudyParametersProps> = ({ study, isOwner, userId }) => {
  // SF-SKAT counts each cohort's individuals from its prepared data
  const askNumInds = study.study_type !== "SF-SKAT";

  return (
    <Row className="p-3 text-start">
      {study.participants.map((participant: string, index: number) => {
        if (index === 0) return null;
        const displayName = study["display_names"][participant];
        const editable = userId === participant;
        const personalParameters = study.personal_parameters[participant];
        // the API sends the participant's own PRINT_LOGS only
        const printLogs = personalParameters?.PRINT_LOGS;
        return (
          <React.Fragment key={participant}>
            {askNumInds && (
              <>
                <Form.Label column htmlFor={`NUM_INDS${participant}`} className="col-form-label">
                  Number of Individuals for {displayName}
                </Form.Label>
                <Col sm="3">
                  <Form.Control
                    type="number"
                    id={`NUM_INDS${participant}`}
                    name={`NUM_INDS${participant}`}
                    defaultValue={personalParameters?.NUM_INDS?.value}
                    disabled={!editable}
                    required
                  />
                </Col>
                <p className="mt-1 text-start text-muted">Number of Individuals/Rows in {displayName}'s Data</p>
              </>
            )}
            {printLogs && editable && (
              <>
                <Form.Label column htmlFor="PRINT_LOGS" className="col-form-label">
                  {printLogs.name} for {displayName}
                </Form.Label>
                <Col sm="3">
                  <ParameterControl parameter={printLogs} parameterName="PRINT_LOGS" disabled={false} />
                </Col>
                <p className="mt-1 text-start text-muted">{printLogs.description}</p>
              </>
            )}
          </React.Fragment>
        );
      })}
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
            <ParameterControl
              parameter={study.parameters[parameterName]}
              parameterName={parameterName}
              disabled={!isOwner}
              required
            />
          </Col>
          <p className="mt-1 text-start text-muted">{study.parameters[parameterName].description}</p>
        </React.Fragment>
      ))}
      { study.advanced_parameters.index.length ? (
        <Accordion className="mb-3" id="advancedParameters">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Advanced Parameters</Accordion.Header>
          <Accordion.Body>
            {study.advanced_parameters.index.map((parameterName) => (
              <React.Fragment key={parameterName}>
                <Form.Floating className="mb-3">
                  <ParameterControl
                    parameter={study.advanced_parameters[parameterName]}
                    parameterName={parameterName}
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
      ) : <div/> }
    </Row>
  );
};

export default SharedStudyParameters;
