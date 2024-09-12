export const submitStudyParameters = async (
  formEvent: React.FormEvent<HTMLFormElement> | FormData,
  apiBaseUrl: string,
  studyId: string,
  headers: HeadersInit,
  setFeedback?: (feedback: string) => void,
  setErrorMessage?: (message: string) => void,
  setParams?: (params: Record<string, string | number>) => void,
) => {
  if (!(formEvent instanceof FormData)) {
    formEvent.preventDefault();
  }
  const formData = formEvent instanceof FormData
    ? formEvent : new FormData(formEvent.currentTarget);
  const parameters: Record<string, string | number> = {};
  formData.forEach((value, key) => {
    if (key === "BASE_P") {
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