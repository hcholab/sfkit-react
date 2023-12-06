import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../App";
import useAuthToken from "../hooks/useAuthToken";

const Profile = () => {
  const { apiBaseUrl } = useContext(AppContext);
  const { userId: userIdFromParams } = useParams();
  const decodedUserIdFromParams = decodeURIComponent(userIdFromParams || "");
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    about: "",
  });

  const { idToken, userId } = useAuthToken();

  useEffect(() => {
    if (!idToken) {
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/profile/${decodedUserIdFromParams}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfileData({
            displayName: data.profile.displayName || "",
            about: data.profile.about || "",
          });
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, [apiBaseUrl, idToken, decodedUserIdFromParams]);

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
      const response = await fetch(
        `${apiBaseUrl}/api/profile/${decodedUserIdFromParams}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        console.log("Profile updated successfully");
        setIsEditMode(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
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
              {isEditMode ? (
                <form onSubmit={handleFormSubmit}>
                  {/* Edit mode with form inputs */}
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
                  {/* ... (more form inputs for other profile data) */}
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
