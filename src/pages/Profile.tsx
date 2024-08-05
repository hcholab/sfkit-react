import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import { AppContext } from "../App";
import LoginButton from "../components/LoginButton";
import useFirestore from "../hooks/useFirestore";
import useGenerateAuthHeaders from "../hooks/useGenerateAuthHeaders";

const Profile = () => {
  const { apiBaseUrl } = useContext(AppContext);
  const headers = useGenerateAuthHeaders();
  const { userId: userIdFromParams } = useParams();
  const decodedUserIdFromParams = decodeURIComponent(userIdFromParams || "");
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    about: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const idToken = useAuth().user?.id_token || "";
  const { userId } = useFirestore();

  if (!idToken) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ transform: "translateY(+200%)" }}
      >
        <p className="mb-4">Please log in to view a user profile.</p>
        <LoginButton />
      </div>
    );
  }

  useEffect(() => {
    if (!idToken) {
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/profile/${decodedUserIdFromParams}`, {
          headers,
        });

        if (response.ok) {
          const { profile: p } = await response.json();
          setProfileData({
            displayName: p.displayName || "",
            email: p.email || "",
            about: p.about || "",
          });
        } else {
          console.error("Failed to fetch profile data");
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setErrorMessage("An error occurred while fetching the profile data.");
      }
    };

    fetchProfileData();
  }, [apiBaseUrl, idToken, decodedUserIdFromParams, headers]);

  const handleEditToggle = () => {
    setIsEditMode((prevMode) => !prevMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/api/profile/${decodedUserIdFromParams}`, {
        method: "POST",
        headers,
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        setIsEditMode(false);
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        console.error(errorData.error || "Failed to update profile");
        setErrorMessage(errorData.error || "Failed to update profile");
      }
    } catch (error) {
      setErrorMessage("Failed to update profile");
    }
  };

  const isOwnProfile = userId === decodedUserIdFromParams;

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-9 mx-auto">
            <div className="p-5 bg-light rounded">
              <h2 className="fw-normal text-center">Profile</h2>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {isEditMode ? (
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="displayName">
                      <b>Display Name</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="displayName"
                      name="displayName"
                      value={profileData.displayName}
                      onChange={handleInputChange}
                    />
                    <div className="form-text">This is the name that will be displayed on your posts.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="about">
                      <b>About</b>
                    </label>
                    <textarea
                      className="form-control"
                      id="about"
                      name="about"
                      rows={3}
                      value={profileData.about}
                      onChange={handleInputChange}
                    />
                    <div className="form-text">
                      Role description. Only shown to other participants in studies you are in.
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-3">
                    <p>
                      <b>Display Name</b>
                      <br />
                      {profileData.displayName}
                      {isOwnProfile && (
                        <button className="btn btn-link text-decoration-none" onClick={handleEditToggle}>
                          Edit
                        </button>
                      )}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      <b>Email</b>
                      <br />
                      {profileData.email}
                    </p>
                  </div>
                  <div className="mb-3">
                    <p>
                      <b>About</b>
                      <br />
                      {profileData.about}
                      {isOwnProfile && (
                        <button className="btn btn-link text-decoration-none" onClick={handleEditToggle}>
                          Edit
                        </button>
                      )}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
