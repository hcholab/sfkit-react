import "bootstrap/dist/css/bootstrap.min.css";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../App";
import { getDb } from "../hooks/firebase";

interface NotificationListProps {
  userId: string;
  idToken: string;
}

const NotificationList: React.FC<NotificationListProps> = ({ userId, idToken }) => {
  const { apiBaseUrl } = useContext(AppContext);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(doc(getDb(), "users", userId), (doc) => {
        let newNotifications = [];
        if (doc.exists() && doc.data()) {
          newNotifications = doc.data()!.notifications;
        }
        setNotifications(newNotifications);
      }, console.error);

      return () => unsubscribe();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(doc(getDb(), "users", "display_names"), (doc) => {
        if (doc.exists() && doc.data()) {
          setDisplayName(doc.data()[userId]);
        }
      }, console.error);

      return () => unsubscribe();
    }
  }, [userId]);

  const removeNotification = async (index: number) => {
    try {
      setNotifications((prev) => prev.filter((_, i) => i !== index));

      const response = await fetch(`${apiBaseUrl}/api/update_notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ notification: notifications[index] }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log("Notification removed successfully");
    } catch (error) {
      console.error("Failed to remove notification:", error);
    }
  };

  return (
    <Dropdown className="me-3">
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
        {displayName}
        <span
          id="num_notifications"
          className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${
            notifications.length ? "bg-danger" : "bg-secondary"
          }`}
        >
          {notifications.length}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu align="end" style={{ minWidth: "300px" }}>
        {notifications.length ? (
          <>
            <Dropdown.Header>Notifications</Dropdown.Header>
            {notifications.map((notification, index) => (
              <Dropdown.ItemText key={index} className="alert alert-info alert-dismissible mb-0 mt-0 text-muted small">
                {notification}
                <button
                  className="btn-sm btn-close"
                  type="button"
                  data-bs-dismiss="alert"
                  onClick={() => removeNotification(index)}
                ></button>
              </Dropdown.ItemText>
            ))}
          </>
        ) : (
          <Dropdown.ItemText className="text-center text-muted">No new notifications</Dropdown.ItemText>
        )}
        <Dropdown.Divider />
        <Link to={`/profile/${userId}`} className="dropdown-item text-center text-primary">
          Profile
        </Link>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationList;
