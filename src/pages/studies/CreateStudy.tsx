import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthToken from "../../hooks/useAuthToken";

const CreateStudy: React.FC = () => {
  const { idToken, userId } = useAuthToken();
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

    const requestData = {
      ...formData,
      study_type: studyType,
      setup_configuration: setupConfig,
      user_id: userId,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/create_study`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.study_title) {
        navigate(`/studies/${data.study_title}`);
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
                  <Button variant="outline-secondary" className="me-2 mt-3" href="/studies">
                    Cancel
                  </Button>
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
