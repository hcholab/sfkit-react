import { SubmitEvent } from "react";
import { Parameter, ParameterGroup, ParameterType } from "../types/study";

// The API tells us which control to render via the parameter's "type", defaulting to "number".
// Studies created before "type" existed have no such field, so fall back to recognizing the
// string values a boolean parameter can hold.
export const parameterType = (parameter?: Parameter): ParameterType => {
  if (parameter?.type) return parameter.type;
  if (parameter?.value === "true" || parameter?.value === "false") return "boolean";
  return "number";
};

// Names of the parameters the API declares as "text". The API expects their values as strings,
// even when they look like numbers (e.g. a single chromosome "22").
export const textParameterNames = (...groups: ParameterGroup[]): Set<string> =>
  new Set(groups.flatMap((group) => group.index.filter((name) => parameterType(group[name]) === "text")));

export const submitStudyParameters = async (
  eventForm: SubmitEvent<HTMLFormElement> | FormData,
  apiBaseUrl: string,
  studyId: string,
  headers: HeadersInit,
  setFeedback?: (feedback: string) => void,
  setErrorMessage?: (message: string) => void,
  setParams?: (params: Record<string, string | number>) => void,
  textParameters?: Set<string>,
) => {
  if (!(eventForm instanceof FormData)) {
    eventForm.preventDefault();
  }
  const formData = eventForm instanceof FormData
    ? eventForm : new FormData(eventForm.target);
  const parameters: Record<string, string | number> = {};
  formData.forEach((value, key) => {
    if (key === "BASE_P" || textParameters?.has(key)) {
      parameters[key] = value.toString();
    } else if (typeof value === "string") {
      const numberValue = Number(value);
      parameters[key] = !isNaN(numberValue) && value !== "" && numberValue <= Number.MAX_SAFE_INTEGER ? numberValue : value;
    }
  });

  try {
    const response = await fetch(`${apiBaseUrl}/api/parameters?study_id=${studyId}`, {
      method: "POST",
      headers,
      body: JSON.stringify(parameters),
    });
    if (!response.ok) {
      throw new Error((await response.json()).error || "Unexpected error");
    }

    if (setParams) {
      setParams(parameters);
    }

    if (setFeedback) {
      setFeedback("Success!");
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.error("Failed to save study parameters:", error);
    if (setFeedback) {
      setFeedback("Failed! - " + (error as Error).message);
    }
    if (setErrorMessage) {
      setErrorMessage((error as Error).message || "Failed to save study parameters");
    }
  }
};
