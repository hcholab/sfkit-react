export const submitStudyParameters = async (
  event: React.FormEvent<HTMLFormElement>,
  apiBaseUrl: string,
  studyId: string,
  headers: HeadersInit,
  setFeedback?: (feedback: string) => void,
  setErrorMessage?: (message: string) => void
) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const parameters: { [key: string]: string | number } = {};
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