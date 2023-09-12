import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getDb } from "../hooks/firebase";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface NotificationListProps {
  userId: string;
}

const NotificationList: React.FC<NotificationListProps> = ({ userId }) => {
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
      });

      return () => unsubscribe();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(doc(getDb(), "users", "display_names"), (doc) => {
        if (doc.exists() && doc.data()) {
          setDisplayName(doc.data()[userId]);
        }
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const removeNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
    // TODO: request backend to remove notification
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
        <Dropdown.Item href={`/profile/${userId}`} className="text-center text-primary">
          Profile
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationList;
