import React, { useContext, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import useGenerateAuthHeaders from "../../hooks/useGenerateAuthHeaders";
import { useAuth } from "react-oidc-context";

const CreateStudy: React.FC = () => {
  const { apiBaseUrl } = useContext(AppContext);
  const idToken = useAuth().user?.id_token || "";
  const headers = useGenerateAuthHeaders();
  const location = useLocation();
  const { studyType, setupConfig } = location.state as { studyType: string; setupConfig: string };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    study_information: "",
    private_study: false,
    demo_study: false,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !idToken &&
      !window.confirm("You are not logged in. Do you want to continue creating the study without logging in?")
    ) {
      return;
    }

    const requestData = {
      ...formData,
      study_type: studyType,
      setup_configuration: setupConfig,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/create_study`, {
        method: "POST",
        headers,
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || "Unexpected error");
      }

      const data = await response.json();

      if (data.study_id) {
        if (!idToken) {
          navigate(`/studies/${data.study_id}/${data.auth_key}`, { state: { isNewStudy: true } });
        } else {
          navigate(`/studies/${data.study_id}`, { state: { isNewStudy: true } });
        }
      } else {
        throw new Error("Unexpected error: Study title not returned from server");
      }
    } catch (error: unknown) {
      console.error("Error creating study:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <section className="py-5 mt-5 mb-5">
      <Container>
        <Row>
          <Col lg={8} className="mx-auto">
            <div className="p-5 bg-light rounded text-center">
              <h2 className="h2 display-7 fw-normal">New Study ({studyType})</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Control
                  className="mt-4"
                  type="text"
                  name="title"
                  value={formData.title}
                  maxLength={50}
                  required
                  placeholder="Study Title"
                  onChange={handleChange}
                />
                <Form.Control
                  className="mt-3"
                  type="text"
                  name="description"
                  value={formData.description}
                  placeholder="(optional) One-line Description of Your Study."
                  onChange={handleChange}
                />
                <Form.Control
                  className="mt-3"
                  as="textarea"
                  name="study_information"
                  value={formData.study_information}
                  rows={4}
                  placeholder="(optional) Study Information: Any additional details you want to include.  This can contain things like Motivation, Goals, and Data Sources."
                  onChange={handleChange}
                />
                <div className="text-start">
                  <small>(details and information can be edited later)</small>
                </div>
                <Form.Check
                  className="mt-2 float-start"
                  type="switch"
                  id="private_study"
                  label="Private Study (other participants can view and join only by invitation)"
                  name="private_study"
                  checked={formData.private_study}
                  onChange={handleCheckboxChange}
                />
                <Form.Check
                  className="mt-2 float-start"
                  type="switch"
                  id="demo_study"
                  label="Demo Study (for tutorial - run with only one user and doesn't require user-provided data)"
                  name="demo_study"
                  checked={formData.demo_study}
                  onChange={handleCheckboxChange}
                />
                <div>
                  <Link to="/studies" className="btn btn-outline-secondary me-2 mt-3">
                    Cancel
                  </Link>
                  <Button variant="primary" type="submit" className="mt-3">
                    Confirm
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CreateStudy;
