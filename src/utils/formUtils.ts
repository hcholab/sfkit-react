export const submitStudyParameters = async (
  event: React.FormEvent<HTMLFormElement>,
  apiBaseUrl: string,
  studyId: string,
  headers: HeadersInit,
  setFeedback?: (feedback: string) => void
) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  let parameters: { [key: string]: string | number } = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") {
      const numberValue = Number(value);
      parameters[key] = !isNaN(numberValue) && value !== "" ? numberValue : value;
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
      setFeedback("Failed!");
    }
  }
};