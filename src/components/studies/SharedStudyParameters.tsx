import React, { useState } from "react";
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
  onChange?: (value: string) => void;
}

// Renders the form control matching the parameter's type: a No/Yes select for booleans (whose value
// is submitted as the string "false"/"true"), otherwise a text or number input.
const ParameterControl: React.FC<ParameterControlProps> = ({ parameter, parameterName, disabled, required, onChange }) => {
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
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      required={required}
    />
  );
};

// sfkit upper-cases ancestry labels
const parseAncestries = (value?: string | number): string[] => [
  ...new Set(
    String(value ?? "")
      .split(",")
      .map((ancestry) => ancestry.trim().toUpperCase())
      .filter(Boolean)
  ),
];

// SF-SKAT stores a participant's Number of Individuals per ancestry, e.g. "EUR=1000,AFR=500"
const parseNumIndsPerAncestry = (value?: string | number): Record<string, string> =>
  Object.fromEntries(
    String(value ?? "")
      .split(",")
      .map((item) => item.split("=").map((part) => part.trim()))
      .filter(([ancestry, count]) => ancestry && count)
      .map(([ancestry, count]) => [ancestry.toUpperCase(), count])
  );

interface NumIndsPerAncestryProps {
  participant: string;
  displayName: string;
  ancestries: string[];
  value?: string | number;
  editable: boolean;
}

// Renders one Number of Individuals field per ancestry, which a hidden input submits together
// as the participant's NUM_INDS.
const NumIndsPerAncestry: React.FC<NumIndsPerAncestryProps> = ({
  participant,
  displayName,
  ancestries,
  value,
  editable,
}) => {
  const [counts, setCounts] = useState(() => parseNumIndsPerAncestry(value));
  const name = `NUM_INDS${participant}`;

  return (
    <>
      {ancestries.map((ancestry) => (
        <React.Fragment key={ancestry}>
          <Form.Label column htmlFor={`${name}-${ancestry}`} className="col-form-label">
            Number of Individuals for {displayName} ({ancestry})
          </Form.Label>
          <Col sm="3">
            <Form.Control
              type="number"
              min="1"
              id={`${name}-${ancestry}`}
              value={counts[ancestry] ?? ""}
              onChange={(e) => setCounts({ ...counts, [ancestry]: e.target.value })}
              disabled={!editable}
              required
            />
          </Col>
          <p className="mt-1 text-start text-muted">
            Number of Individuals/Rows of ancestry {ancestry} in {displayName}'s Data
          </p>
        </React.Fragment>
      ))}
      <input
        type="hidden"
        name={name}
        value={ancestries
          .filter((ancestry) => counts[ancestry])
          .map((ancestry) => `${ancestry}=${counts[ancestry]}`)
          .join(",")}
        disabled={!editable}
      />
    </>
  );
};

const SharedStudyParameters: React.FC<SharedStudyParametersProps> = ({ study, isOwner, userId }) => {
  const perAncestry = study.study_type === "SF-SKAT";
  // follows the Ancestries field as it is edited, so that its count fields appear right away
  const [ancestries, setAncestries] = useState(() => parseAncestries(study.parameters.ancestries?.value));

  return (
    <Row className="p-3 text-start">
      {study.participants.map((participant: string, index: number) => {
        if (index === 0) return null;
        const displayName = study["display_names"][participant];
        const editable = userId === participant;
        const personalParameters = study.personal_parameters[participant];
        const masks = personalParameters?.MASKS;
        return (
          <React.Fragment key={participant}>
            {perAncestry ? (
              <NumIndsPerAncestry
                participant={participant}
                displayName={displayName}
                ancestries={ancestries}
                value={personalParameters?.NUM_INDS?.value}
                editable={editable}
              />
            ) : (
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
            {masks && (
              <>
                <Form.Label column htmlFor={`MASKS${participant}`} className="col-form-label">
                  {masks.name} for {displayName}
                </Form.Label>
                <Col sm="3">
                  <Form.Control
                    type="text"
                    id={`MASKS${participant}`}
                    // only the participant's own masks are submitted, under the name the API expects
                    name={editable ? "MASKS" : undefined}
                    defaultValue={masks.value}
                    disabled={!editable}
                    required
                  />
                </Col>
                <p className="mt-1 text-start text-muted">{masks.description}</p>
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
              onChange={parameterName === "ancestries" ? (value) => setAncestries(parseAncestries(value)) : undefined}
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
